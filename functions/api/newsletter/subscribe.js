// Cloudflare Pages Function — POST /api/newsletter/subscribe
//
// Step 1 of the double opt-in: sends a "confirm your subscription" email
// through Resend with a signed link (see lib/newsletter-token.js). Nothing
// is stored and no contact is created until the link is clicked
// (functions/api/newsletter/confirm.js).
//
// Environment variables (Cloudflare Pages → Settings → Variables and Secrets):
//   RESEND_API_KEY             secret
//   NEWSLETTER_FROM            e.g. "KOLAidees <nouveautes@your-verified-domain>"
//                              (the domain must be verified in Resend)
//   NEWSLETTER_SIGNING_SECRET  secret, long random string
//   RESEND_SEGMENT_ID          optional — used by confirm.js

import { createToken, isValidEmail } from '../../../lib/newsletter-token.js';

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function confirmationEmail(link) {
  const subject = 'Confirmez votre inscription aux nouveautés de KOLAidees';
  const text = [
    'Bonjour,',
    '',
    'Pour recevoir les nouveautés de KOLAidees, confirmez votre adresse en ouvrant ce lien (valable 48 heures) :',
    link,
    '',
    "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email : vous ne serez pas inscrit.",
    '',
    'KOLAidees — Livres, savoirs, création',
  ].join('\n');
  const html = `<!doctype html><html lang="fr"><body style="font-family:Arial,sans-serif;color:#1a1714;line-height:1.6;max-width:520px;margin:0 auto;padding:24px">
<p>Bonjour,</p>
<p>Pour recevoir les nouveautés de <strong>KOLAidees</strong>, confirmez votre adresse&nbsp;:</p>
<p style="margin:28px 0"><a href="${link}" style="background:#1a1714;color:#f7f1e6;padding:14px 22px;border-radius:6px;text-decoration:none;font-weight:bold">Confirmer mon inscription</a></p>
<p style="font-size:13px;color:#6b635b">Ce lien est valable 48&nbsp;heures. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email&nbsp;: vous ne serez pas inscrit.</p>
<p style="font-size:13px;color:#6b635b">KOLAidees — Livres, savoirs, création</p>
</body></html>`;
  return { subject, text, html };
}

export async function onRequestPost({ request, env }) {
  const origin = new URL(request.url).origin;
  const sender = request.headers.get('Origin');
  if (sender && sender !== origin) return json(403, { error: 'forbidden' });

  let data;
  try {
    data = await request.json();
  } catch {
    return json(400, { error: 'invalid' });
  }

  // Honeypot: a hidden field real visitors never fill. Pretend success so
  // bots get no signal.
  if (data && data.website) return json(200, { ok: true });

  const email = typeof data?.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (!isValidEmail(email)) return json(400, { error: 'invalid_email' });

  if (!env.RESEND_API_KEY || !env.NEWSLETTER_FROM || !env.NEWSLETTER_SIGNING_SECRET) {
    return json(503, { error: 'unavailable' });
  }

  const token = await createToken(email, env.NEWSLETTER_SIGNING_SECRET);
  const link = `${origin}/api/newsletter/confirm?t=${encodeURIComponent(token)}`;
  const { subject, text, html } = confirmationEmail(link);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: env.NEWSLETTER_FROM, to: [email], subject, text, html }),
  });
  if (!res.ok) return json(502, { error: 'send_failed' });

  // Same answer whether or not the address is already subscribed: the
  // endpoint must not reveal who is on the list.
  return json(200, { ok: true });
}
