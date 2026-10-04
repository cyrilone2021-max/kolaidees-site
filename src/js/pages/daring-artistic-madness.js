import '../../css/style.css';
import { renderHeader, renderFooter } from '../layout.js';
import { AMAZON_BOOK_URL_EN_KINDLE } from '../../config/site.js';

// English-language edition page. The shared header/footer are reused as-is
// (same architecture as every other page); no newsletter or social-links
// block is mounted here since both currently render French-only copy
// (see src/js/newsletter.js and renderSocialLinks in src/js/layout.js) and
// this page must not carry accidental French content.
renderHeader('daring-artistic-madness');
renderFooter('en');

// Kindle button: href comes from the single source of truth in site.js.
// The static href in the HTML is kept identical as a no-JS fallback.
document
  .querySelectorAll('[data-amazon-link="en-kindle"]')
  .forEach((a) => a.setAttribute('href', AMAZON_BOOK_URL_EN_KINDLE));
