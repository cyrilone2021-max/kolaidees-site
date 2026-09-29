// --- Amplitude adapter — NOT a real integration yet ----------------------
//
// This module is a placeholder, clearly marked as such. It does not:
//   - import '@amplitude/unified' (not installed — see package.json),
//   - make any network call,
//   - hardcode the Amplitude ingestion key anywhere in this file.
//
// The ingestion key shared earlier in chat is deliberately NOT written
// here, not even in this comment. Before it is wired in, its owner needs
// to explicitly confirm it is really their own Amplitude project's
// ingestion key — it has only appeared inside pasted instruction files so
// far, never stated directly as "this is my key."
//
// Once confirmed, the real integration is a small, contained change:
//
//   import * as amplitude from '@amplitude/unified';
//   amplitude.initAll(API_KEY, {
//     analytics: { autocapture: true },
//     sessionReplay: { sampleRate: 1 },
//   });
//
// initialized here only once (see initAnalytics below), reading the key
// from VITE_AMPLITUDE_API_KEY (see .env.example) — never hardcoded.

const API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

let initialized = false;

export function initAnalytics() {
  if (initialized) return; // must only ever initialize once
  initialized = true;

  if (!API_KEY) {
    console.warn('Amplitude API key missing — analytics disabled');
    return;
  }

  // A key is present (VITE_AMPLITUDE_API_KEY was set) but the real SDK is
  // still not installed/wired — do not claim analytics are active.
  console.warn(
    'Amplitude key configured but the SDK is not installed yet — analytics still disabled (see src/js/analytics.js)'
  );
}

// The only event this project is allowed to send, fired once at home-page
// load (see src/js/main.js). Currently a no-op: nothing is sent anywhere.
export function trackViewedHomePage() {
  if (!API_KEY) return;
  // Real call goes here once the SDK above is actually wired in:
  //   amplitude.track('Viewed Home Page', { prompt_version: 'BA400.4' });
}
