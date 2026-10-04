import '../../css/style.css';
import { renderHeader, renderFooter } from '../layout.js';
import { initTracking } from '../tracking.js';

renderHeader('a-propos');
renderFooter();

// Anonymous audience events for 1CLIC Control Tower (see tracking.js).
initTracking();
