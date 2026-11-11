import '../../css/style.css';
import { renderHeader, renderFooter, renderSocialLinks } from '../layout.js';
import { initTracking } from '../tracking.js';
import { mountNewsletterForm } from '../newsletter.js';
import { AMAZON_OVERTHINKING_FR_URL } from '../../config/site.js';

renderHeader('projets');
renderFooter();
renderSocialLinks(document.getElementById('social-links-root'));
mountNewsletterForm(document.getElementById('newsletter-root'));

// The shared header's buy button opens Oser; on this page it must open
// « Arrête de trop penser » instead.
document
  .querySelectorAll('#site-header a.btn-primary')
  .forEach((a) => a.setAttribute('href', AMAZON_OVERTHINKING_FR_URL));

// Anonymous audience events for 1CLIC Control Tower (see tracking.js).
initTracking();
