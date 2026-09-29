// Central configuration — every page imports from here instead of
// hardcoding links, so there is exactly one place to change each value.

export const BRAND_NAME = 'KOLAidees';

// Real, public Amazon product page — never the KDP link.
export const AMAZON_BOOK_URL = 'https://www.amazon.fr/dp/B0HJ8JXMN8';

export const SOCIAL = {
  tiktok: 'https://www.tiktok.com/@kola_idees/video/7690043628156194070?lang=fr',
  instagram: 'https://www.instagram.com/kola.idees/',
  facebook: 'https://www.facebook.com/profile.php?id=61592982996384&sk=directory_links',
  goodreads: 'https://www.goodreads.com/review/list/204465609?ref=nav_mybooks',
};

// --- Not-yet-real values -------------------------------------------------
// These are intentionally empty: the site is not deployed, so there is no
// real public URL, no real share image, and no real newsletter endpoint
// yet. Do not invent values here — set them when each thing is actually
// true, via the matching VITE_* env var (see .env.example).

// Real deployed URL, once the site is live (used for canonical links / OG).
export const SITE_URL = import.meta.env.VITE_SITE_URL || '';

// Real Open Graph share image, once one exists.
export const OG_IMAGE_URL = import.meta.env.VITE_OG_IMAGE_URL || '';

// Privacy policy link — placeholder until a real page/URL exists.
export const PRIVACY_URL = '#';

// Newsletter endpoint — empty means "no real backend yet": the newsletter
// form only simulates success locally and makes no network call at all.
// See src/js/newsletter.js.
export const NEWSLETTER_ENDPOINT = '';
