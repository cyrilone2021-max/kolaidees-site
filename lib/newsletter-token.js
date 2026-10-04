// Signed, expiring confirmation tokens for the newsletter double opt-in.
//
// Resend has no built-in double opt-in, so the confirmation link carries
// its own proof: base64url(JSON {e: email, x: expiry}) + "." + HMAC-SHA256
// of that payload with NEWSLETTER_SIGNING_SECRET. No database is needed —
// a token is valid if and only if its signature matches and it has not
// expired. Shared by functions/api/newsletter/subscribe.js and confirm.js.

const TOKEN_TTL_MS = 48 * 60 * 60 * 1000;

const encoder = new TextEncoder();

function toBase64Url(bytes) {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text) {
  const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createToken(email, secret, now = Date.now()) {
  const payload = toBase64Url(encoder.encode(JSON.stringify({ e: email, x: now + TOKEN_TTL_MS })));
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

// Returns the email for a valid, unexpired token, otherwise null.
export async function verifyToken(token, secret, now = Date.now()) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  try {
    const valid = await crypto.subtle.verify(
      'HMAC',
      await hmacKey(secret),
      fromBase64Url(signature),
      encoder.encode(payload)
    );
    if (!valid) return null;
    const { e, x } = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    if (typeof e !== 'string' || typeof x !== 'number' || x < now) return null;
    return e;
  } catch {
    return null;
  }
}

export function isValidEmail(email) {
  return (
    typeof email === 'string' &&
    email.length <= 254 &&
    /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/.test(email)
  );
}
