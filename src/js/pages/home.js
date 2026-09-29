import '../../css/style.css';
import { renderHeader, renderFooter } from '../layout.js';
import { mountNewsletterForm } from '../newsletter.js';
import { initAnalytics, trackViewedHomePage } from '../analytics.js';

renderHeader('home');
renderFooter();
mountNewsletterForm(document.getElementById('newsletter-root'));

// "Viewed Home Page" is the single explicit event this project sends,
// fired once at load, on the home page only.
initAnalytics();
trackViewedHomePage();
