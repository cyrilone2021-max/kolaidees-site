// Newsletter form — double opt-in through Resend.
//
// Submitting posts the address to NEWSLETTER_ENDPOINT (Pages Function
// functions/api/newsletter/subscribe.js), which emails a confirmation link.
// The visitor is only added to the list once that link is clicked
// (functions/api/newsletter/confirm.js), so the success message here says
// "check your inbox", never "you are subscribed".
//
// A successful request is also counted as an anonymous "newsletter_signup"
// event (see tracking.js) — the address itself is never part of it.

import { NEWSLETTER_ENDPOINT, BRAND_NAME, PRIVACY_URL } from '../config/site.js';
import { trackNewsletterSignup } from './tracking.js';

const MESSAGES = {
  sent: 'Presque fini : un email de confirmation vient de vous être envoyé. Cliquez sur le lien qu’il contient pour valider votre inscription.',
  invalid_email: 'Cette adresse email ne semble pas valide. Vérifiez-la et réessayez.',
  error: 'L’inscription n’a pas pu aboutir. Réessayez dans quelques minutes.',
};

export function mountNewsletterForm(root) {
  if (!root) return;
  const form = root.querySelector('form');
  const confirmation = root.querySelector('[data-newsletter-confirmation]');
  if (!form) return;

  if (confirmation) confirmation.hidden = true;

  // Honeypot: invisible to people (and to screen readers), filled by bots.
  form.insertAdjacentHTML(
    'beforeend',
    '<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">'
  );

  // Information shown at the point of collection (GDPR).
  form.insertAdjacentHTML(
    'afterend',
    `<p class="newsletter-consent">Vous recevrez un email pour confirmer votre inscription. Votre adresse sert uniquement à l’envoi des nouveautés de ${BRAND_NAME} ; désinscription possible à tout moment. <a href="${PRIVACY_URL}">Politique de confidentialité</a>.</p>`
  );

  const button = form.querySelector('button[type="submit"]');

  function show(message, isError) {
    if (!confirmation) return;
    confirmation.textContent = message;
    confirmation.classList.toggle('is-error', Boolean(isError));
    confirmation.hidden = false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button) button.disabled = true;

    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.value, website: form.website.value }),
      });
      if (res.ok) {
        form.hidden = true;
        show(MESSAGES.sent, false);
        trackNewsletterSignup();
        return;
      }
      const data = await res.json().catch(() => ({}));
      show(data.error === 'invalid_email' ? MESSAGES.invalid_email : MESSAGES.error, true);
    } catch {
      show(MESSAGES.error, true);
    } finally {
      if (button) button.disabled = false;
    }
  });
}
