// Shared header (nav) and footer, injected into every page's
// #site-header / #site-footer placeholders. One source of truth: a new
// nav link or social link is added here once, not per page.

import {
  BRAND_NAME,
  SOCIAL,
  PRIVACY_URL,
  AMAZON_AUTHOR,
  LEA_MARLOWE_AUTHOR,
  LOGO_URL,
} from '../config/site.js';
import { languageTarget } from '../config/pages.js';

// Nav links by language. The English links stay inside the English version.
const NAV_LINKS = {
  fr: [
    { href: '/projets/', label: 'Livres', page: 'projets' },
    { href: '/#plumes', label: 'Plumes invitées', page: 'plumes' },
    { href: '/#avis', label: 'Avis', page: 'avis' },
    { href: '/a-propos/', label: 'À propos', page: 'a-propos' },
  ],
  en: [
    { href: '/en/#books', label: 'Books', page: 'books-en' },
    { href: '/en/#pen-names', label: 'Pen names', page: 'pen-names-en' },
    { href: '/en/#reviews', label: 'Reviews', page: 'reviews-en' },
    { href: '/en/about/', label: 'About', page: 'about-en' },
  ],
};

const HOME_PATH = { fr: '/', en: '/en/' };

// The header button opens the Amazon Author page by default; a book page
// passes its own Amazon link instead (renderHeader(page, lang, buy)).
const HEADER_COPY = {
  fr: {
    mainNav: 'Navigation principale',
    mobileNav: 'Navigation mobile',
    openMenu: 'Ouvrir le menu',
    langSwitch: 'Langue',
    buy: { label: 'Page auteur Amazon', url: AMAZON_AUTHOR.fr },
  },
  en: {
    mainNav: 'Main navigation',
    mobileNav: 'Mobile navigation',
    openMenu: 'Open menu',
    langSwitch: 'Language',
    buy: { label: 'Amazon author page', url: AMAZON_AUTHOR.en },
  },
};

function brandHtml(lang) {
  const logo = LOGO_URL ? `<img src="${LOGO_URL}" alt="" width="44" height="44" />` : '';
  return `<a class="brand" href="${HOME_PATH[lang] || HOME_PATH.fr}">${logo}<span>KOLA idées</span></a>`;
}

// FR/EN switch: targets come from the page registry (src/config/pages.js).
function langSwitchHtml(lang, label) {
  const item = (code) =>
    code === lang
      ? `<span class="lang-switch__item" aria-current="true">${code.toUpperCase()}</span>`
      : `<a class="lang-switch__item" href="${languageTarget(window.location.pathname, code)}" hreflang="${code}" lang="${code}">${code.toUpperCase()}</a>`;
  return `<div class="lang-switch" role="group" aria-label="${label}">${item('fr')}<span class="lang-switch__sep" aria-hidden="true">|</span>${item('en')}</div>`;
}

function navLinkHtml(link, currentPage) {
  const current = link.page === currentPage ? ' aria-current="page"' : '';
  return `<a class="nav-link" href="${link.href}"${current}>${link.label}</a>`;
}

export function renderHeader(currentPage, lang = 'fr', buy) {
  const header = document.getElementById('site-header');
  if (!header) return;

  const t = HEADER_COPY[lang] || HEADER_COPY.fr;
  const b = buy || t.buy;
  const links = (NAV_LINKS[lang] || NAV_LINKS.fr).map((l) => navLinkHtml(l, currentPage)).join('');
  const langSwitch = langSwitchHtml(lang, t.langSwitch);
  const buyBtn = (extra = '') =>
    `<a class="btn btn-primary btn-small" href="${b.url}" target="_blank" rel="noopener"${extra}>${b.label}</a>`;

  header.innerHTML = `
    <div class="site-header__row">
      ${brandHtml(lang)}
      <nav class="desktop-nav" aria-label="${t.mainNav}">
        ${links}
        ${langSwitch}
        ${buyBtn()}
      </nav>
      <button class="hamburger" id="nav-toggle" aria-label="${t.openMenu}" aria-expanded="false" aria-controls="mobile-nav">☰</button>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="${t.mobileNav}">
      ${links}
      ${langSwitch}
      ${buyBtn(' style="margin-top: 10px; width: fit-content;"')}
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

const FOOTER_COPY = {
  fr: {
    tagline: 'Livres, savoirs, création.',
    follow: 'Suivre KOLA',
    authors: 'Pages auteurs',
    readers: 'Lecteurs',
    review: 'Laisser un avis',
    reviewHref: '/#avis',
    allBooks: 'Tous les livres',
    allBooksHref: '/projets/',
    amazonAuthor: 'Cyril Mukendi sur Amazon',
    leaAuthor: 'Léa Marlowe sur Amazon',
    disclaimer:
      'Ce contenu est présenté à titre créatif et éditorial&nbsp;; il ne remplace pas un avis médical ou psychologique professionnel.',
    rights: 'Tous droits réservés.',
    privacy: 'Politique de confidentialité',
  },
  en: {
    tagline: 'Books, ideas, creation.',
    follow: 'Follow KOLA',
    authors: 'Author pages',
    readers: 'Readers',
    review: 'Leave a review',
    reviewHref: '/en/#reviews',
    allBooks: 'All books',
    allBooksHref: '/en/#books',
    amazonAuthor: 'Cyril Mukendi on Amazon',
    leaAuthor: 'Léa Marlowe on Amazon',
    disclaimer:
      'This content is presented for creative and editorial purposes; it does not replace professional medical or psychological advice.',
    rights: 'All rights reserved.',
    privacy: 'Privacy Policy',
    affiliate: 'As an Amazon Associate, KOLAidees earns from qualifying purchases.',
  },
};

export function renderFooter(lang = 'fr') {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  const year = new Date().getFullYear();
  const t = FOOTER_COPY[lang] || FOOTER_COPY.fr;
  const ext = 'target="_blank" rel="noopener"';

  footer.innerHTML = `
    <div class="site-footer__band" aria-hidden="true"></div>
    <div class="container">
      <div class="site-footer__row">
        <div>
          ${brandHtml(lang)}
          <p style="margin: 10px 0 0;">${t.tagline}</p>
        </div>
        <div class="site-footer__cols">
          <div class="site-footer__col">
            <strong>${t.follow}</strong>
            <a href="${SOCIAL.tiktok}" ${ext}>TikTok</a>
            <a href="${SOCIAL.instagram}" ${ext}>Instagram</a>
            <a href="${SOCIAL.facebook}" ${ext}>Facebook</a>
          </div>
          <div class="site-footer__col">
            <strong>${t.authors}</strong>
            <a href="${AMAZON_AUTHOR[lang] || AMAZON_AUTHOR.fr}" ${ext}>${t.amazonAuthor}</a>
            <a href="${LEA_MARLOWE_AUTHOR[lang] || LEA_MARLOWE_AUTHOR.fr}" ${ext}>${t.leaAuthor}</a>
            <a href="${SOCIAL.goodreads}" ${ext}>Goodreads</a>
          </div>
          <div class="site-footer__col">
            <strong>${t.readers}</strong>
            <a href="${t.allBooksHref}">${t.allBooks}</a>
            <a href="${t.reviewHref}">${t.review}</a>
          </div>
        </div>
      </div>
      <p class="disclaimer">${t.disclaimer}</p>
      ${t.affiliate ? `<p class="disclaimer" style="margin-top: 8px;">${t.affiliate}</p>` : ''}
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
        <span style="font-size: 13px; font-weight: 700;">${i.label}</span>
      </a>`
    )
    .join('');
}
