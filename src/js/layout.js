// Shared header (nav) and footer, injected into every page's
// #site-header / #site-footer placeholders. One source of truth: a new
// nav link or social link is added here once, not per page.

import { BRAND_NAME, AMAZON_BOOK_URL, SOCIAL, PRIVACY_URL } from '../config/site.js';

// Header copy by language. 'fr' is the existing default used by every
// French page (renderHeader(page) with no lang). 'en' is used only by the
// English edition page: same links (they still lead to the French pages for
// now), English labels, and no header purchase button (the English page
// carries its own Amazon.com purchase links in its content).
const NAV_LINKS = [
  { href: '/', label: { fr: 'Accueil', en: 'Home' }, page: 'home' },
  { href: '/projets/', label: { fr: 'Projets', en: 'Projects' }, page: 'projets' },
  { href: '/a-propos/', label: { fr: 'À propos', en: 'About' }, page: 'a-propos' },
];

const HEADER_COPY = {
  fr: {
    mainNav: 'Navigation principale',
    mobileNav: 'Navigation mobile',
    openMenu: 'Ouvrir le menu',
    langSwitch: 'Langue',
  },
  en: {
    mainNav: 'Main navigation',
    mobileNav: 'Mobile navigation',
    openMenu: 'Open menu',
    langSwitch: 'Language',
  },
};

// FR/EN switch. The only English page is the English edition of the book,
// so: any French page -> EN = English edition; English page -> FR = the
// French book page (its French equivalent).
const LANG_TARGETS = {
  fr: '/projets/oser-la-demence-artistique/',
  en: '/daring-artistic-madness/',
};

function langSwitchHtml(lang, label) {
  const item = (code) =>
    code === lang
      ? `<span class="lang-switch__item" aria-current="true">${code.toUpperCase()}</span>`
      : `<a class="lang-switch__item" href="${LANG_TARGETS[code]}" hreflang="${code}" lang="${code}">${code.toUpperCase()}</a>`;
  return `<div class="lang-switch" role="group" aria-label="${label}">${item('fr')}<span class="lang-switch__sep" aria-hidden="true">|</span>${item('en')}</div>`;
}

function navLinkHtml(link, currentPage, lang, extraClass = '') {
  const current = link.page === currentPage ? ' aria-current="page"' : '';
  return `<a class="nav-link ${extraClass}" href="${link.href}"${current}>${link.label[lang] || link.label.fr}</a>`;
}

export function renderHeader(currentPage, lang = 'fr') {
  const header = document.getElementById('site-header');
  if (!header) return;

  const t = HEADER_COPY[lang] || HEADER_COPY.fr;
  const links = NAV_LINKS.map((l) => navLinkHtml(l, currentPage, lang)).join('');
  const langSwitch = langSwitchHtml(lang, t.langSwitch);
  // Purchase button kept on French pages only (unchanged, Amazon.fr).
  const buyDesktop =
    lang === 'fr'
      ? `<a class="btn btn-primary" href="${AMAZON_BOOK_URL}" target="_blank" rel="noopener">Découvrir le livre</a>`
      : '';
  const buyMobile =
    lang === 'fr'
      ? `<a class="btn btn-primary" href="${AMAZON_BOOK_URL}" target="_blank" rel="noopener" style="margin-top: 8px; width: fit-content;">Découvrir le livre</a>`
      : '';

  header.innerHTML = `
    <div class="site-header__row">
      <a class="brand" href="/">${BRAND_NAME}</a>
      <nav class="desktop-nav" aria-label="${t.mainNav}">
        ${links}
        ${langSwitch}
        ${buyDesktop}
      </nav>
      <button class="hamburger" id="nav-toggle" aria-label="${t.openMenu}" aria-expanded="false" aria-controls="mobile-nav">☰</button>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="${t.mobileNav}">
      ${links}
      ${langSwitch}
      ${buyMobile}
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
