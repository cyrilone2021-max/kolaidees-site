// Anonymous audience events for 1CLIC Control Tower.
//
// What is sent: only { event, page, lang, source } to /api/track on this
// same site (a Cloudflare Pages Function, see functions/api/track.js),
// which adds the secret ingest token server-side and forwards to the
// Control Tower. No cookie, no email, no IP, no user identifier is ever
// collected or sent from here.
//
// Events:
//   page_view          — once per page load
//   amazon_click       — click on any link to an Amazon store
//   newsletter_signup  — newsletter form submitted (see newsletter.js:
//                        the address itself is never sent anywhere)

const ENDPOINT = '/api/track';
const SOURCE_KEY = 'kolaidees_source';

// Known referrers → source label. Anything else external is 'referral'.
const REFERRER_SOURCES = [
  ['instagram.com', 'instagram'],
  ['tiktok.com', 'tiktok'],
  ['facebook.com', 'facebook'],
  ['goodreads.com', 'goodreads'],
  ['google.', 'google'],
  ['bing.com', 'bing'],
];

let initialized = false;

// Source of the visit, kept for the whole browsing session so that a click
// on the 3rd page is still attributed to the Instagram bio link that
// brought the visitor in. ?utm_source= wins over the referrer.
function detectSource() {
  const fromUrl = new URLSearchParams(window.location.search).get('utm_source');
  if (fromUrl) {
    const clean = fromUrl.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32);
    if (clean) return remember(clean);
  }

  const stored = recall();
  if (stored) return stored;

  let host = '';
  try {
    host = document.referrer ? new URL(document.referrer).hostname : '';
  } catch {
    host = '';
  }
  if (!host || host === window.location.hostname) return remember('direct');
  const match = REFERRER_SOURCES.find(([domain]) => host.includes(domain));
  return remember(match ? match[1] : 'referral');
}

function remember(source) {
  try {
    sessionStorage.setItem(SOURCE_KEY, source);
  } catch {
    // Storage blocked (private mode): attribution just falls back per page.
  }
  return source;
}

function recall() {
  try {
    return sessionStorage.getItem(SOURCE_KEY);
  } catch {
    return null;
  }
}

function send(event) {
  if (import.meta.env.DEV) return; // no Pages Function under `vite dev`

  const body = JSON.stringify({
    event,
    page: window.location.pathname,
    lang: document.documentElement.lang === 'en' ? 'en' : 'fr',
    source: detectSource(),
  });

  // sendBeacon survives the page being left, which matters for clicks that
  // open Amazon. Same-origin, so no CORS preflight.
  const sent =
    navigator.sendBeacon &&
    navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
  if (!sent) {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

function isAmazonLink(anchor) {
  try {
    return /(^|\.)amazon\.[a-z.]+$/.test(new URL(anchor.href).hostname);
  } catch {
    return false;
  }
}

export function initTracking() {
  if (initialized) return;
  initialized = true;

  send('page_view');

  // Delegated listener: also covers the header button injected by
  // layout.js and any link added later.
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href]');
    if (anchor && isAmazonLink(anchor)) send('amazon_click');
  });
}

export function trackNewsletterSignup() {
  send('newsletter_signup');
}
