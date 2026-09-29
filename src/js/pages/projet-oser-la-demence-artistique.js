import '../../css/style.css';
import { renderHeader, renderFooter, renderSocialLinks } from '../layout.js';
import { mountNewsletterForm } from '../newsletter.js';

renderHeader('projets');
renderFooter();
renderSocialLinks(document.getElementById('social-links-root'));
mountNewsletterForm(document.getElementById('newsletter-root'));
