require('@shopify/shopify-api/adapters/node');
const { shopifyApi, ApiVersion } = require('@shopify/shopify-api');

let shopify = null;

function getShopify() {
  if (shopify) return shopify;

  if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET) {
    throw new Error(
      'Missing SHOPIFY_API_KEY / SHOPIFY_API_SECRET environment variables'
    );
  }

  const appUrl = process.env.SHOPIFY_APP_URL || 'http://localhost:3000';
  const hostName = appUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: (process.env.SHOPIFY_SCOPES || '').split(',').filter(Boolean),
    hostName,
    hostScheme: appUrl.startsWith('http://') ? 'http' : 'https',
    apiVersion: process.env.SHOPIFY_API_VERSION || ApiVersion.January25,
    isEmbeddedApp: true,
  });

  return shopify;
}

module.exports = { getShopify };
