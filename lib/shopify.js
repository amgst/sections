require('@shopify/shopify-api/adapters/node');
const { shopifyApi, ApiVersion } = require('@shopify/shopify-api');

const appUrl = process.env.SHOPIFY_APP_URL || 'http://localhost:3000';
const hostName = appUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: (process.env.SHOPIFY_SCOPES || '').split(',').filter(Boolean),
  hostName,
  hostScheme: appUrl.startsWith('http://') ? 'http' : 'https',
  apiVersion: process.env.SHOPIFY_API_VERSION || ApiVersion.January25,
  isEmbeddedApp: true,
});

module.exports = { shopify };
