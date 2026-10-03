// Shared header (nav) and footer, injected into every page's
// #site-header / #site-footer placeholders. One source of truth: a new
// nav link or social link is added here once, not per page.

import { BRAND_NAME, AMAZON_BOOK_URL, SOCIAL, PRIVACY_URL } from '../config/site.js';

const NAV_LINKS = [
  { href: '/', label: 'Accueil', page: 'home' },
  { href: '/projets/', label: 'Projets', page: 'projets' },
  { href: '/a-propos/', label: 'À propos', page: 'a-propos' },
];

function navLinkHtml(link, currentPage, extraClass = '') {
  const current = link.page === currentPage ? ' aria-current="page"' : '';
  return `<a class="nav-link ${extraClass}" href="${link.href}"${current}>${link.label}</a>`;
}

export function renderHeader(currentPage) {
  const header = document.getElementById('site-header');
  if (!header) return;

  header.innerHTML = `
    <div class="site-header__row">
      <a class="brand" href="/">${BRAND_NAME}</a>
      <nav class="desktop-nav" aria-label="Navigation principale">
        ${NAV_LINKS.map((l) => navLinkHtml(l, currentPage)).join('')}
        <a class="btn btn-primary" href="${AMAZON_BOOK_URL}" target="_blank" rel="noopener">Découvrir le livre</a>
      </nav>
      <button class="hamburger" id="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-nav">☰</button>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="Navigation mobile">
      ${NAV_LINKS.map((l) => navLinkHtml(l, currentPage)).join('')}
      <a class="btn btn-primary" href="${AMAZON_BOOK_URL}" target="_blank" rel="noopener" style="margin-top: 8px; width: fit-content;">Découvrir le livre</a>
    </nav>
  `;

  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  toggle.addEventListener('click', () => {
    const willOpen = !mobileNav.classList.contains('is-open');
    mobileNav.classList.toggle('is-open', willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
    toggle.textContent = willOpen ? '✕' : '☰';
  });
  mobileNav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    })
  );
}

// Footer copy by language. 'fr' is the existing, unchanged default used by
// every page already calling renderFooter() with no argument. 'en' is used
// only by the English edition page (renderFooter('en')).
const FOOTER_COPY = {
  fr: {
    tagline: 'Oser la démence artistique',
    disclaimer:
      'Ce contenu est présenté à titre créatif et éditorial&nbsp;; il ne remplace pas un avis médical ou psychologique professionnel.',
    rights: 'Tous droits réservés.',
    privacy: 'Politique de confidentialité',
  },
  en: {
    tagline: 'Daring Artistic Madness',
    disclaimer:
      'This content is presented for creative and editorial purposes; it does not replace professional medical or psychological advice.',
    rights: 'All rights reserved.',
    privacy: 'Privacy Policy',
  },
};

export function renderFooter(lang = 'fr') {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  const year = new Date().getFullYear();
  const t = FOOTER_COPY[lang] || FOOTER_COPY.fr;

  footer.innerHTML = `
    <div class="container">
      <div class="site-footer__row">
        <div>
          <span class="brand">${BRAND_NAME}</span>
          <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.7;">${t.tagline}</p>
        </div>
        <div class="site-footer__social">
          <a class="nav-link" href="${SOCIAL.tiktok}" target="_blank" rel="noopener">TikTok</a>
          <a class="nav-link" href="${SOCIAL.instagram}" target="_blank" rel="noopener">Instagram</a>
          <a class="nav-link" href="${SOCIAL.facebook}" target="_blank" rel="noopener">Facebook</a>
          <a class="nav-link" href="${SOCIAL.goodreads}" target="_blank" rel="noopener">Goodreads</a>
        </div>
      </div>
      <p class="disclaimer">${t.disclaimer}</p>
      <div class="site-footer__legal">
        <span>&copy; ${year} ${BRAND_NAME}. ${t.rights}</span>
        <a href="${PRIVACY_URL}" style="text-decoration: underline;">${t.privacy}</a>
      </div>
    </div>
  `;
}

export function renderSocialLinks(container) {
  if (!container) return;
  const items = [
    { key: 'tiktok', label: 'TikTok', badge: 'TT' },
    { key: 'instagram', label: 'Instagram', badge: 'IG' },
    { key: 'facebook', label: 'Facebook', badge: 'FB' },
    { key: 'goodreads', label: 'Goodreads', badge: 'GR' },
  ];
  container.innerHTML = items
    .map(
      (i) => `
      <a class="social-link" href="${SOCIAL[i.key]}" target="_blank" rel="noopener" aria-label="${BRAND_NAME} sur ${i.label}">
        <span class="social-badge" aria-hidden="true">${i.badge}</span>
        <span style="font-size: 13px; font-weight: 600;">${i.label}</span>
      </a>`
    )
    .join('');
}
