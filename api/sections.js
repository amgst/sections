module.exports = (req, res) => {
  res.status(200).json([
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
};
