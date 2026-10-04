// Cloudflare Pages Function — GET /api/newsletter/confirm?t=<token>
//
// Step 2 of the double opt-in: the link from the confirmation email lands
// here. A valid, unexpired token (see lib/newsletter-token.js) creates the
// contact in Resend (or re-subscribes it if it already exists) and adds it
// to RESEND_SEGMENT_ID when set. Answers with a small standalone HTML page.

import { verifyToken } from '../../../lib/newsletter-token.js';

const RESEND = 'https://api.resend.com';

function page(title, message, status) {
  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${title} — KOLAidees</title></head>
<body style="margin:0;background:#f7f1e6;color:#1a1714;font-family:Arial,sans-serif">
<main style="max-width:520px;margin:0 auto;padding:96px 24px;text-align:center;line-height:1.6">
<p style="letter-spacing:.14em;text-transform:uppercase;font-size:12px;font-weight:bold">KOLAidees</p>
<h1 style="font-size:30px;margin:12px 0 16px">${title}</h1>
<p>${message}</p>
<p style="margin-top:32px"><a href="/" style="background:#1a1714;color:#f7f1e6;padding:14px 22px;border-radius:6px;text-decoration:none;font-weight:bold">Retour au site</a></p>
</main></body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function resend(env, path, method, body) {
  return fetch(`${RESEND}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function onRequestGet({ request, env }) {
  if (!env.RESEND_API_KEY || !env.NEWSLETTER_SIGNING_SECRET) {
    return page('Service indisponible', "L'inscription n'est pas disponible pour le moment. Réessayez plus tard.", 503);
  }

  const token = new URL(request.url).searchParams.get('t');
  const email = await verifyToken(token, env.NEWSLETTER_SIGNING_SECRET);
  if (!email) {
    return page(
      'Lien expiré ou invalide',
      'Ce lien de confirmation a expiré (48&nbsp;heures) ou est incomplet. Inscrivez-vous à nouveau depuis le site pour recevoir un nouveau lien.',
      400
    );
  }

  let res = await resend(env, '/contacts', 'POST', { email, unsubscribed: false });
  if (!res.ok) {
    // Already a contact (possibly unsubscribed earlier): an explicit new
    // confirmation re-subscribes it.
    res = await resend(env, `/contacts/${encodeURIComponent(email)}`, 'PATCH', { unsubscribed: false });
  }
  if (res.ok && env.RESEND_SEGMENT_ID) {
    res = await resend(
      env,
      `/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(env.RESEND_SEGMENT_ID)}`,
      'POST'
    );
  }
  if (!res.ok) {
    return page('Une erreur est survenue', "Votre inscription n'a pas pu être enregistrée. Réessayez dans quelques minutes.", 502);
  }

  return page(
    'Inscription confirmée',
    'Merci&nbsp;! Vous recevrez les prochaines étapes du manifeste et les nouveautés de KOLAidees. Chaque email contiendra un lien pour vous désinscrire.',
    200
  );
}
