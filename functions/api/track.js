// Cloudflare Pages Function — POST /api/track
//
// Receives the anonymous events sent by src/js/tracking.js and forwards
// them to 1CLIC Control Tower (POST /api/ingest/kolaidees). The ingest
// token lives only here, server-side, so it never reaches the browser.
//
// Environment variables (Cloudflare Pages → Settings → Variables and Secrets):
//   CONTROL_TOWER_INGEST_URL  e.g. https://revenue-hub-proto.emergent.host/api/ingest/kolaidees
//   KOLAIDEES_INGEST_TOKEN    secret — same value as in the Control Tower
// While either is missing, events are accepted and silently dropped, so the
// site keeps working before the Control Tower side is deployed.
//
// Only whitelisted, non-personal fields are forwarded: no IP, no user
// agent, no email, no identifier.

const EVENTS = new Set(['page_view', 'amazon_click', 'newsletter_signup']);
const MAX_BODY_BYTES = 1024;
const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse/i;

const noContent = () => new Response(null, { status: 204 });

export async function onRequestPost({ request, env, waitUntil }) {
  // Same-origin only: the site itself is the only legitimate sender.
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) {
    return new Response('Forbidden', { status: 403 });
  }

  // Crawlers and link previews are not readers.
  if (BOT_UA.test(request.headers.get('User-Agent') || '')) return noContent();

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return new Response('Payload too large', { status: 413 });

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return new Response('Bad request', { status: 400 });
  }
  if (!data || !EVENTS.has(data.event)) return new Response('Bad request', { status: 400 });

  const payload = {
    event: data.event,
    page: typeof data.page === 'string' && data.page.startsWith('/') ? data.page.slice(0, 128) : '/',
    lang: data.lang === 'en' ? 'en' : 'fr',
    source:
      typeof data.source === 'string'
        ? data.source.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32) || 'direct'
        : 'direct',
    ts: new Date().toISOString(),
  };

  if (!env.CONTROL_TOWER_INGEST_URL || !env.KOLAIDEES_INGEST_TOKEN) return noContent();

  // Forward in the background: the visitor never waits on the Control Tower.
  waitUntil(
    fetch(env.CONTROL_TOWER_INGEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Ingest-Token': env.KOLAIDEES_INGEST_TOKEN,
      },
      body: JSON.stringify(payload),
    }).catch(() => {})
  );

  return noContent();
}
