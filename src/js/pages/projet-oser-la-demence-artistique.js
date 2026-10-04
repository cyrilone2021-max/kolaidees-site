import '../../css/style.css';
import { renderHeader, renderFooter, renderSocialLinks } from '../layout.js';
import { initTracking } from '../tracking.js';
import { mountNewsletterForm } from '../newsletter.js';

renderHeader('projets');
renderFooter();
renderSocialLinks(document.getElementById('social-links-root'));
mountNewsletterForm(document.getElementById('newsletter-root'));

// Anonymous audience events for 1CLIC Control Tower (see tracking.js).
initTracking();
