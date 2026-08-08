// Each entry is a catalog "design". Multiple entries can share the same
// `block.handle` (a Theme App Extension block type, capped at 30 total —
// see extensions/section-blocks/blocks/) and are differentiated by
// `block.design`, which must match a "design" select option value in that
// block's schema. Entries without a `block` field have no shipped design
// yet and stay "Not installable yet" in the catalog UI.
module.exports = [
  {
    id: 'hero-classic-centered',
    name: 'Classic Centered Hero',
    category: 'Hero',
    price: 'Free',
    description: 'Centered heading, subheading and button over a solid background.',
    tags: ['popular', 'trending', 'hero'],
    block: { handle: 'wb-hero-banner', design: 'classic-centered', designLabel: 'Classic centered' }
  },
  {
    id: 'hero-split-image',
    name: 'Split Image Hero',
    category: 'Hero',
    price: 'Free',
    description: 'Hero message alongside a supporting image, image left or right.',
    tags: ['trending', 'hero'],
    block: { handle: 'wb-hero-banner', design: 'split-image', designLabel: 'Split image' }
  },
  {
    id: 'hero-video-background',
    name: 'Video Background Hero',
    category: 'Hero',
    price: 'Pro',
    description: 'Full-bleed looping video behind your hero message.',
    tags: ['trending', 'hero', 'video'],
    block: { handle: 'wb-hero-banner', design: 'video-background', designLabel: 'Video background' }
  },
  {
    id: 'hero-minimal-text',
    name: 'Minimal Text Hero',
    category: 'Hero',
    price: 'Free',
    description: 'Understated, type-only hero for brand-led launches.',
    tags: ['newest', 'hero', 'text'],
    block: { handle: 'wb-hero-banner', design: 'minimal-text', designLabel: 'Minimal text' }
  },
  {
    id: 'hero-announcement-overlay',
    name: 'Announcement Overlay Hero',
    category: 'Hero',
    price: 'Free',
    description: 'Hero with a badge overlay for sales and limited-time offers.',
    tags: ['newest', 'hero', 'countdown'],
    block: { handle: 'wb-hero-banner', design: 'announcement-overlay', designLabel: 'Announcement overlay' }
  },
  {
    id: 'product-grid',
    name: 'Product Grid',
    category: 'Features',
    price: 'Pro',
    description: 'Flexible product showcase with quick add buttons.',
    tags: ['popular', 'trending', 'features'],
    block: { handle: 'wb-product-grid', design: null, designLabel: null }
  },
  {
    id: 'testimonials-single-quote',
    name: 'Single Quote Testimonial',
    category: 'Testimonial',
    price: 'Free',
    description: 'One large, standout customer quote.',
    tags: ['trending', 'testimonial', 'free'],
    block: { handle: 'wb-testimonials', design: 'single-quote', designLabel: 'Single quote' }
  },
  {
    id: 'testimonials-quote-photo',
    name: 'Quote with Photo',
    category: 'Testimonial',
    price: 'Free',
    description: 'Customer quote paired with a headshot for extra trust.',
    tags: ['trending', 'testimonial', 'free'],
    block: { handle: 'wb-testimonials', design: 'quote-with-photo', designLabel: 'Quote with photo' }
  },
  {
    id: 'testimonials-stat-highlight',
    name: 'Stat Highlight Testimonial',
    category: 'Testimonial',
    price: 'Free',
    description: 'Pairs a quote with a bold stat, like a rating or number sold.',
    tags: ['newest', 'testimonial', 'free'],
    block: { handle: 'wb-testimonials', design: 'stat-highlight', designLabel: 'Stat highlight' }
  },
  {
    id: 'testimonials-video',
    name: 'Video Testimonial',
    category: 'Testimonial',
    price: 'Pro',
    description: 'Customer video quote with a poster image and play button.',
    tags: ['newest', 'testimonial', 'video'],
    block: { handle: 'wb-testimonials', design: 'video-testimonial', designLabel: 'Video testimonial' }
  },
  {
    id: 'video-showcase',
    name: 'Video Showcase',
    category: 'Video',
    price: 'Pro',
    description: 'Autoplaying product video with tappable hotspots.',
    tags: ['trending', 'video']
  },
  {
    id: 'comparison-table',
    name: 'Comparison Table',
    category: 'Features',
    price: 'Pro',
    description: 'Side-by-side plan or product comparison grid.',
    tags: ['trending', 'features']
  },
  {
    id: 'sticky-cart',
    name: 'Sticky Add-to-cart',
    category: 'Cart',
    price: 'Pro',
    description: 'Persistent bar that keeps checkout one tap away.',
    tags: ['trending', 'popular', 'cart']
  },
  {
    id: 'countdown-bar',
    name: 'Countdown Bar',
    category: 'Countdown',
    price: 'Free',
    description: 'Urgency banner with a live sale countdown timer.',
    tags: ['newest', 'countdown', 'free']
  },
  {
    id: 'announcement-scroller',
    name: 'Announcement Scroller',
    category: 'Scrolling',
    price: 'Free',
    description: 'Marquee strip for shipping perks and promo codes.',
    tags: ['newest', 'scrolling', 'free']
  },
  {
    id: 'image-collage',
    name: 'Image Collage',
    category: 'Images',
    price: 'Free',
    description: 'Editorial-style grid for lookbook and lifestyle shots.',
    tags: ['newest', 'images', 'free']
  },
  {
    id: 'newsletter-signup',
    name: 'Newsletter Signup',
    category: 'Snippet',
    price: 'Free',
    description: 'Email capture block with a discount code reveal.',
    tags: ['newest', 'snippet', 'free']
  },
  {
    id: 'faq-accordion',
    name: 'FAQ Accordion',
    category: 'Snippet',
    price: 'Free',
    description: 'Collapsible question list to cut support tickets.',
    tags: ['newest', 'snippet', 'free']
  },
  {
    id: 'text-banner',
    name: 'Text Banner',
    category: 'Text',
    price: 'Free',
    description: 'Bold statement strip for brand values or press logos.',
    tags: ['newest', 'text', 'free']
  },
  {
    id: 'feature-grid',
    name: 'Feature Grid',
    category: 'Features',
    price: 'Free',
    description: 'Icon-led grid to explain product benefits at a glance.',
    tags: ['popular', 'features', 'free']
  },
  {
    id: 'footer-links',
    name: 'Footer Links Pro',
    category: 'Snippet',
    price: 'Free',
    description: 'Multi-column footer with socials and trust badges.',
    tags: ['popular', 'snippet', 'free']
  }
];
