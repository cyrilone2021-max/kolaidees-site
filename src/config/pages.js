// Page registry — the single list of the site's public pages.
//
// Used both at build time (vite.config.js: build entries, sitemap.xml,
// canonical / og:url / og:locale / hreflang tags) and in the browser
// (src/js/layout.js: FR/EN language switch). Plain data only: this file is
// imported by Node and by the browser, so it must not use import.meta.env.
//
// Adding a page = one entry here + its HTML file.
// Adding a translation = give both pages the same `translationKey`.

export const LOCALES = {
  fr: 'fr_FR',
  en: 'en_US',
};

// Where the language switch goes when the current page has no translation.
export const LANG_FALLBACK = {
  fr: '/',
  en: '/daring-artistic-madness/',
};

export const PAGES = [
  { name: 'main', path: '/', lang: 'fr' },
  { name: 'projets', path: '/projets/', lang: 'fr' },
  {
    name: 'projetOserLaDemenceArtistique',
    path: '/projets/oser-la-demence-artistique/',
    lang: 'fr',
    translationKey: 'oser-tome-1',
  },
  {
    name: 'daringArtisticMadness',
    path: '/daring-artistic-madness/',
    lang: 'en',
    translationKey: 'oser-tome-1',
  },
  { name: 'aPropos', path: '/a-propos/', lang: 'fr' },
  { name: 'politiqueDeConfidentialite', path: '/politique-de-confidentialite/', lang: 'fr' },
];

// Normalises '/x/index.html', '/x' and '/x/' to '/x/'.
export function normalizePath(path) {
  let p = path.replace(/index\.html$/, '');
  if (!p.startsWith('/')) p = `/${p}`;
  if (!p.endsWith('/')) p = `${p}/`;
  return p;
}

export function findPage(path) {
  const p = normalizePath(path);
  return PAGES.find((page) => page.path === p);
}

// Other-language versions of a page (same translationKey), itself included.
export function translationsOf(page) {
  if (!page || !page.translationKey) return page ? [page] : [];
  return PAGES.filter((p) => p.translationKey === page.translationKey);
}

// Build-time consistency check (called from vite.config.js). Throws on the
// first problem so a bad registry entry can never reach production.
export function validateRegistry() {
  const names = new Set();
  const paths = new Set();
  for (const page of PAGES) {
    if (names.has(page.name)) throw new Error(`pages.js: duplicate name "${page.name}"`);
    names.add(page.name);
    if (page.path !== normalizePath(page.path)) {
      throw new Error(`pages.js: path "${page.path}" must start and end with "/"`);
    }
    if (paths.has(page.path)) throw new Error(`pages.js: duplicate path "${page.path}"`);
    paths.add(page.path);
    if (!LOCALES[page.lang]) throw new Error(`pages.js: unknown lang "${page.lang}" on ${page.path}`);
  }
  const groups = {};
  for (const page of PAGES) {
    if (!page.translationKey) continue;
    const langs = (groups[page.translationKey] ||= new Set());
    if (langs.has(page.lang)) {
      throw new Error(`pages.js: translationKey "${page.translationKey}" has two "${page.lang}" pages`);
    }
    langs.add(page.lang);
  }
  for (const [lang, path] of Object.entries(LANG_FALLBACK)) {
    if (!LOCALES[lang]) throw new Error(`pages.js: LANG_FALLBACK has unknown lang "${lang}"`);
    const target = findPage(path);
    if (!target || target.lang !== lang) {
      throw new Error(`pages.js: LANG_FALLBACK.${lang} "${path}" must be a "${lang}" page of the registry`);
    }
  }
}

// Target of the language switch for `lang`, from the page at `path`.
export function languageTarget(path, lang) {
  const page = findPage(path);
  const match = translationsOf(page).find((p) => p.lang === lang);
  return match ? match.path : LANG_FALLBACK[lang];
}
