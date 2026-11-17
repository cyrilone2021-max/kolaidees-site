import '../../css/style.css';
import { renderHeader, renderFooter, renderSocialLinks } from '../layout.js';
import { initTracking } from '../tracking.js';
import { mountNewsletterForm } from '../newsletter.js';
import { AMAZON_BOOK_URL } from '../../config/site.js';

renderHeader('projets', 'fr', { label: 'Acheter le livre', url: AMAZON_BOOK_URL });
renderFooter();
renderSocialLinks(document.getElementById('social-links-root'));
mountNewsletterForm(document.getElementById('newsletter-root'));

// Anonymous audience events for 1CLIC Control Tower (see tracking.js).
initTracking();
