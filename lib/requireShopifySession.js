const { shopify } = require('./shopify');
const { RequestedTokenType } = require('@shopify/shopify-api');
const { getOfflineToken, saveOfflineToken } = require('./sessionStore');

function getSessionToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader) return authHeader.replace(/^Bearer\s+/i, '');
  if (req.query.id_token) return req.query.id_token;
  return null;
}

async function requireShopifySession(req, res, next) {
  try {
    const sessionToken = getSessionToken(req);
    if (!sessionToken) {
      return res.status(401).json({ error: 'Missing Shopify session token' });
    }

    const payload = await shopify.session.decodeSessionToken(sessionToken);
    const shop = new URL(payload.dest).hostname;

    let stored = await getOfflineToken(shop);

    if (!stored) {
      const { session } = await shopify.auth.tokenExchange({
        shop,
        sessionToken,
        requestedTokenType: RequestedTokenType.OfflineAccessToken,
      });
      stored = { accessToken: session.accessToken, scope: session.scope };
      await saveOfflineToken(shop, stored.accessToken, stored.scope);
    }

    req.shopifySession = { shop, accessToken: stored.accessToken };
    next();
  } catch (err) {
    console.error('Shopify session error:', err.message);
    res.status(401).json({ error: 'Invalid or expired Shopify session token' });
  }
}

module.exports = { requireShopifySession };
