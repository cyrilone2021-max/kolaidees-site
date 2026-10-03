import '../../css/style.css';
import { renderHeader, renderFooter } from '../layout.js';

// English-language edition page. The shared header/footer are reused as-is
// (same architecture as every other page); no newsletter or social-links
// block is mounted here since both currently render French-only copy
// (see src/js/newsletter.js and renderSocialLinks in src/js/layout.js) and
// this page must not carry accidental French content.
renderHeader('daring-artistic-madness');
renderFooter('en');
