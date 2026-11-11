import '../../css/style.css';
import { renderHeader, renderFooter } from '../layout.js';
import { initTracking } from '../tracking.js';

// English home page (/en/): the entry point of the English version, listing
// the English-language books. No newsletter block here: the newsletter form
// and its confirmation copy are French-only (see src/js/newsletter.js).
renderHeader('home-en', 'en');
renderFooter('en');

// Anonymous audience events for 1CLIC Control Tower (see tracking.js).
initTracking();
