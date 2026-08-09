const fs = require('fs');
const path = require('path');
const { Liquid, Tag, TypeGuards } = require('liquidjs');

const { isTagToken } = TypeGuards;

const EXTENSION_ROOT = path.join(__dirname, '..', 'extensions', 'section-blocks');
const BLOCKS_DIR = path.join(EXTENSION_ROOT, 'blocks');
const SNIPPETS_DIR = path.join(EXTENSION_ROOT, 'snippets');

const PLACEHOLDER_IMAGE = '/preview-assets/placeholder.svg';
const SCHEMA_RE = /{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/;

// Captures the raw token stream between a start/end tag pair (e.g. style/endstyle,
// form/endform) and re-renders it verbatim wrapped in the given HTML tag, mirroring
// how liquidjs's own CaptureTag consumes remainTokens.
function makeWrapperTag(endName, open, close) {
  return class extends Tag {
    constructor(tagToken, remainTokens, liquid, parser) {
      super(tagToken, remainTokens, liquid);
      this.templates = [];
      while (remainTokens.length) {
        const token = remainTokens.shift();
        if (isTagToken(token) && token.name === endName) return;
        this.templates.push(parser.parseToken(token, remainTokens));
      }
      throw new Error(`tag ${tagToken.getText()} not closed`);
    }
    *render(ctx, emitter) {
      emitter.write(open);
      yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter);
      emitter.write(close);
    }
    *children() {
      return this.templates;
    }
  };
}

const engine = new Liquid({ root: [SNIPPETS_DIR], extname: '.liquid' });

// Shopify theme filters these block files actually use. Preview only ever renders
// our own curated demo settings (see buildDemoSettings), so these don't need to
// resolve real assets/products — just produce markup that looks right.
engine.registerFilter('asset_url', (filename) => `/theme-assets/${filename}`);
engine.registerFilter('stylesheet_tag', (url) => `<link rel="stylesheet" href="${url}">`);
engine.registerFilter('image_url', (img) => img || '');
engine.registerFilter('image_tag', (src, ...args) => {
  if (!src) return '';
  const opts = {};
  for (const arg of args) if (Array.isArray(arg)) opts[arg[0]] = arg[1];
  const cls = opts.class ? ` class="${opts.class}"` : '';
  const loading = opts.loading ? ` loading="${opts.loading}"` : '';
  return `<img src="${src}"${cls}${loading} alt="">`;
});
engine.registerFilter('video_tag', () => '');
engine.registerFilter('font_face', () => '');
engine.registerFilter('money', (cents) => `$${(Number(cents) / 100).toFixed(2)}`);

engine.registerTag('style', makeWrapperTag('endstyle', '<style>', '</style>'));
engine.registerTag('form', makeWrapperTag('endform', '<form class="wb-preview-form">', '</form>'));

function readBlockFile(handle) {
  const filePath = path.join(BLOCKS_DIR, `${handle}.liquid`);
  return fs.readFileSync(filePath, 'utf8');
}

function parseSchema(raw) {
  const match = raw.match(SCHEMA_RE);
  if (!match) throw new Error(`No {% schema %} block found`);
  return JSON.parse(match[1]);
}

function stripSchema(raw) {
  return raw.replace(SCHEMA_RE, '');
}

const DEMO_PRODUCTS = [1, 2, 3, 4].map((n) => ({
  url: '#',
  featured_image: PLACEHOLDER_IMAGE,
  title: `Demo product ${n}`,
  price: 1900 + n * 300,
  selected_or_first_available_variant: { id: n, available: true }
}));

// Every design's settings live under one shared block schema (see data/section-catalog.js
// notes on the dispatcher pattern) — so build a full default settings object generically
// from the schema itself rather than hand-writing per-design fixtures, then layer the
// requested design + a couple of curated stand-ins for fields with no natural default
// (pickers, collections) on top.
function buildDemoSettings(schemaSettings, overrides) {
  const settings = {};
  for (const field of schemaSettings) {
    if (!field.id) continue; // header/paragraph entries have no id
    if (Object.prototype.hasOwnProperty.call(field, 'default')) {
      settings[field.id] = field.default;
      continue;
    }
    switch (field.type) {
      case 'image_picker':
        settings[field.id] = PLACEHOLDER_IMAGE;
        break;
      case 'collection':
        settings[field.id] = { products: DEMO_PRODUCTS };
        break;
      case 'url':
        settings[field.id] = '#';
        break;
      default:
        settings[field.id] = undefined;
    }
  }
  return Object.assign(settings, overrides);
}

function renderBlockPreview(handle, designOverrides) {
  const raw = readBlockFile(handle);
  const schema = parseSchema(raw);
  const body = stripSchema(raw);

  const settings = buildDemoSettings(schema.settings || [], designOverrides);
  const block = { id: 'preview', settings };
  const section = { id: 'preview-section' };

  const extraStylesheet = schema.stylesheet
    ? `<link rel="stylesheet" href="/theme-assets/${schema.stylesheet}">`
    : '';
  const extraScript = schema.javascript
    ? `<script src="/theme-assets/${schema.javascript}" defer></script>`
    : '';

  return engine.parseAndRender(body, { block, section }).then((bodyHtml) => ({
    bodyHtml,
    extraStylesheet,
    extraScript
  }));
}

module.exports = { renderBlockPreview };
