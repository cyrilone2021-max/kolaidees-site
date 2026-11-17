// Central configuration — every page imports from here instead of
// hardcoding links, so there is exactly one place to change each value.

export const BRAND_NAME = 'KOLAidees';

// Real, public Amazon product page — never the KDP link.
export const AMAZON_BOOK_URL = 'https://www.amazon.fr/dp/B0HJ8JXMN8';
// Its paperback (16,99 € on amazon.fr).
export const AMAZON_BOOK_PAPERBACK_URL = 'https://www.amazon.fr/dp/B0HJ7PGWLV';

// Guide « Visibilité & monétisation sur les réseaux sociaux » (ebook Kindle,
// ASIN B0HQD4M6GS, en vente depuis le 4/11/2026).
export const AMAZON_GUIDE_URL = 'https://www.amazon.fr/dp/B0HQD4M6GS';

// « Arrête de trop penser » (ebook ASIN B0HR3V2LPD, broché B0HR53CZC1) and
// its US edition « Stop Overthinking » (Kindle B0HR2T6VWR, paperback
// B0HR44Z5RC), all live on KDP since 10/11/2026.
export const AMAZON_OVERTHINKING_FR_URL = 'https://www.amazon.fr/dp/B0HR3V2LPD';
export const AMAZON_OVERTHINKING_US_URL = 'https://www.amazon.com/dp/B0HR2T6VWR?tag=cyril0e3-20';

// English (US) edition — "Daring Artistic Madness" — already published on
// KDP. URLs are the standard Amazon /dp/<ASIN> form built from the two
// official ASINs provided for this edition (Kindle: B0HLVTC57T, Paperback:
// B0HLWL8P9V), the same construction already used for AMAZON_BOOK_URL
// above — never guessed.
export const AMAZON_BOOK_URL_EN_KINDLE = 'https://www.amazon.com/dp/B0HLVTC57T?tag=cyril0e3-20';
export const AMAZON_BOOK_URL_EN_PAPERBACK = 'https://www.amazon.com/dp/B0HLWL8P9V?tag=cyril0e3-20';

// Profile pages of the KOLA accounts (checked 17/11/2026). Goodreads = the
// author page, not a personal reading list.
export const SOCIAL = {
  tiktok: 'https://www.tiktok.com/@kola_idees',
  instagram: 'https://www.instagram.com/kola.idees/',
  facebook: 'https://www.facebook.com/profile.php?id=61592982996384',
  goodreads: 'https://www.goodreads.com/author/show/72300056.Cyril_Mukendi',
};

// Amazon Author pages (public "stores/author" pages, checked 17/11/2026).
export const AMAZON_AUTHOR = {
  fr: 'https://www.amazon.fr/stores/author/B0HJP5W3KN',
  en: 'https://www.amazon.com/stores/author/B0HJP5W3KN?tag=cyril0e3-20',
};
export const LEA_MARLOWE_AUTHOR = {
  fr: 'https://www.amazon.fr/stores/author/B0HRTT928W',
  en: 'https://www.amazon.com/stores/author/B0HRTT928W?tag=cyril0e3-20',
};

// Romance under the pen name Léa Marlowe (« Plumes invitées »), live 15/11/2026.
export const ONDINE = {
  frKindle: 'https://www.amazon.fr/dp/B0HRS2LJWC',
  frPaperback: 'https://www.amazon.fr/dp/B0HRSRG412',
  enKindle: 'https://www.amazon.com/dp/B0HRSJWXQX?tag=cyril0e3-20',
  enPaperback: 'https://www.amazon.com/dp/B0HRSKKPVM?tag=cyril0e3-20',
};

// Logo with Kuba patterns (the social profile picture). Empty until the
// original file is added to public/img/: the header then shows the wordmark only.
export const LOGO_URL = '';

// --- Not-yet-real values -------------------------------------------------
// These are intentionally empty: the site is not deployed, so there is no
// real public URL, no real share image, and no real newsletter endpoint
// yet. Do not invent values here — set them when each thing is actually
// true, via the matching VITE_* env var (see .env.example).

// Real deployed URL, once the site is live (used for canonical links / OG).
export const SITE_URL = import.meta.env.VITE_SITE_URL || '';

// Real Open Graph share image, once one exists.
export const OG_IMAGE_URL = import.meta.env.VITE_OG_IMAGE_URL || '';

// Privacy policy page (French only; also linked from the English footer).
export const PRIVACY_URL = '/politique-de-confidentialite/';

// Newsletter endpoint — Pages Function that starts the Resend double
// opt-in (see functions/api/newsletter/subscribe.js and src/js/newsletter.js).
export const NEWSLETTER_ENDPOINT = '/api/newsletter/subscribe';
