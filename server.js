const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, service: 'shopify-section-app' });
});

app.get('/api/sections', (_req, res) => {
  res.json([
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
  ]);
});

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Shopify Section App running at http://localhost:${PORT}`);
});
