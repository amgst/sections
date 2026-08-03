require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { getShopify } = require('./lib/shopify');
const { requireShopifySession } = require('./lib/requireShopifySession');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, service: 'shopify-section-app' });
});

const SECTION_CATALOG = [
  {
    id: 'hero-banner',
    name: 'Hero Banner',
    category: 'Marketing',
    price: 'Free',
    description: 'High-converting hero area for promos and launches.'
  },
  {
    id: 'product-grid',
    name: 'Product Grid',
    category: 'Storefront',
    price: 'Pro',
    description: 'Flexible product showcase with quick add buttons.'
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    category: 'Social Proof',
    price: 'Free',
    description: 'Customer review block to boost trust.'
  }
];

// App block handles from extensions/section-blocks/blocks/*.liquid, added to the theme
// via a deep link into the theme editor (direct theme-file writes require a Shopify
// exemption regular apps don't have — see themeFilesUpsert's write_themes restriction).
const THEME_APP_BLOCKS = {
  'hero-banner': 'wb-hero-banner',
  'product-grid': 'wb-product-grid',
  'testimonials': 'wb-testimonials'
};

app.get('/api/sections', (_req, res) => {
  res.json(
    SECTION_CATALOG.map((section) => ({
      ...section,
      installable: Boolean(THEME_APP_BLOCKS[section.id])
    }))
  );
});

app.get('/api/themes', requireShopifySession, async (req, res) => {
  try {
    const shopify = getShopify();
    const client = new shopify.clients.Graphql({ session: req.shopifySession });

    const themeResult = await client.request(`
      query {
        themes(first: 20, roles: [MAIN, UNPUBLISHED]) {
          nodes { id name role }
        }
      }
    `);

    const themes = themeResult.data.themes.nodes
      .map((theme) => ({
        id: theme.id.split('/').pop(),
        name: theme.name,
        role: theme.role
      }))
      .sort((a, b) => (a.role === 'MAIN' ? -1 : b.role === 'MAIN' ? 1 : 0));

    res.json({ themes });
  } catch (err) {
    console.error('Themes list error:', err.message);
    res.status(502).json({ error: 'Failed to reach Shopify Admin API' });
  }
});

app.get('/api/sections/:id/install-link', requireShopifySession, async (req, res) => {
  const handle = THEME_APP_BLOCKS[req.params.id];
  if (!handle) {
    return res.status(404).json({ error: 'This section is not available to install yet' });
  }

  const requestedThemeId = typeof req.query.themeId === 'string' ? req.query.themeId : '';
  if (requestedThemeId && !/^\d+$/.test(requestedThemeId)) {
    return res.status(400).json({ error: 'Invalid theme id' });
  }

  try {
    const shopify = getShopify();
    const client = new shopify.clients.Graphql({ session: req.shopifySession });

    let themeIdNumeric = requestedThemeId;
    let themeName;

    if (themeIdNumeric) {
      const themeResult = await client.request(
        `
          query GetTheme($id: ID!) {
            theme(id: $id) { id name }
          }
        `,
        { variables: { id: `gid://shopify/OnlineStoreTheme/${themeIdNumeric}` } }
      );
      if (!themeResult.data.theme) {
        return res.status(404).json({ error: 'Theme not found' });
      }
      themeName = themeResult.data.theme.name;
    } else {
      const themeResult = await client.request(`
        query {
          themes(first: 1, roles: [MAIN]) {
            nodes { id name }
          }
        }
      `);
      const theme = themeResult.data.themes.nodes[0];
      if (!theme) {
        return res.status(404).json({ error: 'No published theme found on this store' });
      }
      themeIdNumeric = theme.id.split('/').pop();
      themeName = theme.name;
    }

    const editorUrl =
      `https://${req.shopifySession.shop}/admin/themes/${themeIdNumeric}/editor` +
      `?template=index&addAppBlockId=${process.env.SHOPIFY_API_KEY}/${handle}&target=newAppsSection`;

    res.json({ ok: true, theme: themeName, editorUrl });
  } catch (err) {
    console.error('Section install-link error:', err.message);
    res.status(502).json({ error: 'Failed to reach Shopify Admin API' });
  }
});

app.get('/api/shop', requireShopifySession, async (req, res) => {
  try {
    const shopify = getShopify();
    const client = new shopify.clients.Graphql({ session: req.shopifySession });
    const { data } = await client.request(`
      query {
        shop {
          name
          email
          myshopifyDomain
          plan { displayName }
        }
      }
    `);
    res.json(data.shop);
  } catch (err) {
    console.error('Admin API error:', err.message);
    res.status(502).json({ error: 'Failed to reach Shopify Admin API' });
  }
});

const SHOP_DOMAIN_RE = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i;

app.get('/admin', (req, res) => {
  const shopParam = typeof req.query.shop === 'string' ? req.query.shop : '';
  const shop = SHOP_DOMAIN_RE.test(shopParam) ? shopParam : '';
  const frameAncestors = shop
    ? `https://${shop} https://admin.shopify.com`
    : 'https://admin.shopify.com';

  const template = fs.readFileSync(path.join(__dirname, 'views', 'admin.html'), 'utf8');
  const html = template.replace('%%SHOPIFY_API_KEY%%', process.env.SHOPIFY_API_KEY || '');

  res
    .set('Content-Type', 'text/html')
    .set('Content-Security-Policy', `frame-ancestors ${frameAncestors};`)
    .send(html);
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Shopify Section App running at http://localhost:${PORT}`);
  });
}

module.exports = app;
