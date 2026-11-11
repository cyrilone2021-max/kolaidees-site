import '../../css/style.css';
import { renderHeader, renderFooter } from '../layout.js';
import { initTracking } from '../tracking.js';
import { projects } from '../../data/projects.js';

renderHeader('projets');
renderFooter();

const grid = document.getElementById('projects-grid');
if (grid) {
  grid.innerHTML = projects
    .map(
      (p) => `
      <a class="card" href="${p.href}" style="padding: 28px; display: flex; flex-direction: column; gap: 10px; border-radius: 14px;">
        ${p.cover ? `<img src="${p.cover}" width="96" height="154" alt="" style="border-radius: 6px; box-shadow: 0 10px 24px rgba(22,19,15,0.2); margin-bottom: 6px;" />` : ''}
        <span class="kicker">${p.status === 'published' ? 'Disponible' : 'À venir'}</span>
        <h3 style="font-size: 22px; font-weight: 900;">${p.title}</h3>
        <span style="font-size: 14px; font-style: italic; color: var(--accent);">${p.tome}</span>
        <p style="margin: 0; font-size: 14.5px; opacity: 0.8;">${p.summary}</p>
      </a>`
    )
    .join('');
}

// Anonymous audience events for 1CLIC Control Tower (see tracking.js).
initTracking();
