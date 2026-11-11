import '../../css/style.css';
import { renderHeader, renderFooter } from '../layout.js';
import { initTracking } from '../tracking.js';
import { AMAZON_OVERTHINKING_US_URL } from '../../config/site.js';

// English-language page for "Stop Overthinking" (same pattern as
// daring-artistic-madness.js: no French newsletter/social blocks here).
renderHeader('stop-overthinking', 'en');
renderFooter('en');

// The shared EN header's "Get the book" button points to Daring Artistic
// Madness; on this page it must open Stop Overthinking instead.
document
  .querySelectorAll('#site-header a.btn-primary')
  .forEach((a) => a.setAttribute('href', AMAZON_OVERTHINKING_US_URL));

// Anonymous audience events for 1CLIC Control Tower (see tracking.js).
initTracking();
