// Newsletter form — local-only simulation while NEWSLETTER_ENDPOINT is
// empty. This is the ONLY behaviour implemented: no fetch/XHR call exists
// anywhere in this module outside the (currently unreachable) branch that
// would use a real endpoint, so no email is ever sent anywhere as things
// stand.

import { NEWSLETTER_ENDPOINT, BRAND_NAME } from '../config/site.js';

export function mountNewsletterForm(root) {
  if (!root) return;
  const form = root.querySelector('form');
  const confirmation = root.querySelector('[data-newsletter-confirmation]');
  if (!form) return;

  if (confirmation) {
    confirmation.textContent = `Merci — vous êtes inscrit aux nouveautés de ${BRAND_NAME}.`;
    confirmation.hidden = true;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!NEWSLETTER_ENDPOINT) {
      // No real backend configured: simulate success locally, hide the
      // form, show the confirmation message. No address is sent or
      // stored anywhere — this does not pretend an email was registered.
      form.hidden = true;
      if (confirmation) confirmation.hidden = false;
      return;
    }

    // --- Future real integration -----------------------------------
    // Once NEWSLETTER_ENDPOINT points at a real backend (a Vercel
    // function, a Supabase Edge Function, or an emailing provider's
    // double opt-in endpoint), send the address here, e.g.:
    //
    //   fetch(NEWSLETTER_ENDPOINT, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email: form.email.value }),
    //   }).then(...)
    //
    // Not implemented yet — NEWSLETTER_ENDPOINT is empty, so this branch
    // is unreachable today.
  });
}
