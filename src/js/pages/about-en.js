import '../../css/style.css';
import { renderHeader, renderFooter } from '../layout.js';
import { initTracking } from '../tracking.js';

// English version of the About page (/en/about/).
renderHeader('about-en', 'en');
renderFooter('en');

// Anonymous audience events for 1CLIC Control Tower (see tracking.js).
initTracking();
