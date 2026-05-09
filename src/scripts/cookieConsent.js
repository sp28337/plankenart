/**
 * Cookie Consent Manager
 * 
 * Manages user cookie preferences per 152-FZ requirements.
 * Analytics scripts (Yandex Metrika) are blocked until explicit consent.
 * Consent is stored in localStorage (not cookies) to avoid circular dependency.
 * 
 * Categories:
 *   - necessary: Always active. Session-related, no personal data.
 *   - analytics: Yandex Metrika. Blocked by default until user opts in.
 */

const CONSENT_KEY = 'pa_cookie_consent';
const CONSENT_VERSION = 1;

// @returns {{ version: number, analytics: boolean, timestamp: string } | null}
function getConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.version !== CONSENT_VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

// @param {{ analytics: boolean }} preferences
function saveConsent(preferences) {
  const data = {
    version: CONSENT_VERSION,
    analytics: preferences.analytics,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
}

/** Remove all analytics-related cookies */
function clearAnalyticsCookies() {
  const analyticsPrefixes = ['_ym', 'yandex', 'ya_'];
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const name = cookie.split('=')[0].trim();
    const isAnalytics = analyticsPrefixes.some(
      (p) => name.startsWith(p) || name.includes(p)
    );
    if (isAnalytics) {
      // Delete cookie on all possible paths/domains
      const domain = window.location.hostname;
      const paths = ['/', ''];
      for (const path of paths) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=.${domain}`;
      }
    }
  }
}

/** Load Yandex Metrika counter */
function loadYandexMetrika() {
  // Prevent double-loading
  if (window._ymLoaded) return;
  window._ymLoaded = true;

  // Replace YOUR_COUNTER_ID with real Yandex Metrika counter ID
  const COUNTER_ID = 109130750 // window.__YM_COUNTER_ID;
  if (!COUNTER_ID) return;

  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  // @ts-ignore
  window.ym(COUNTER_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false,
  });
}

/** Remove Yandex Metrika and clean up */
function unloadYandexMetrika() {
  window._ymLoaded = false;
  clearAnalyticsCookies();
  // Remove the script tag
  const scripts = document.querySelectorAll('script[src*="mc.yandex.ru"]');
  scripts.forEach((s) => s.remove());
}

// ── Banner UI logic ──

function showBanner() {
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
    banner.classList.add('translate-y-0', 'opacity-100');
  }
}

function hideBanner() {
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
    banner.classList.remove('translate-y-0', 'opacity-100');
  }
}

function showSettings() {
  const panel = document.getElementById('cookie-settings-panel');
  if (panel) {
    panel.classList.remove('hidden');
    // Sync toggle with current state
    const toggle = /** @type {HTMLInputElement|null} */ (
      document.getElementById('analytics-toggle')
    );
    const consent = getConsent();
    if (toggle) {
      toggle.checked = consent?.analytics ?? false;
    }
  }
}

function hideSettings() {
  const panel = document.getElementById('cookie-settings-panel');
  if (panel) {
    panel.classList.add('hidden');
  }
}

/** Accept all cookies */
function acceptAll() {
  saveConsent({ analytics: true });
  loadYandexMetrika();
  hideBanner();
  hideSettings();
}

/** Reject non-necessary cookies */
function rejectAll() {
  saveConsent({ analytics: false });
  unloadYandexMetrika();
  hideBanner();
  hideSettings();
}

/** Save custom settings from the toggle */
function saveSettings() {
  const toggle = /** @type {HTMLInputElement|null} */ (
    document.getElementById('analytics-toggle')
  );
  const analytics = toggle?.checked ?? false;

  saveConsent({ analytics });

  if (analytics) {
    loadYandexMetrika();
  } else {
    unloadYandexMetrika();
  }

  hideBanner();
  hideSettings();
}

// ── Initialization ──

function initCookieConsent() {
  const consent = getConsent();

  // Bind banner buttons
  document.getElementById('cookie-accept-all')?.addEventListener('click', acceptAll);
  document.getElementById('cookie-reject-all')?.addEventListener('click', rejectAll);
  document.getElementById('cookie-configure')?.addEventListener('click', showSettings);
  document.getElementById('cookie-save-settings')?.addEventListener('click', saveSettings);
  document.getElementById('cookie-settings-back')?.addEventListener('click', hideSettings);

  // Footer "Cookie settings" link
  document.getElementById('cookie-settings-trigger')?.addEventListener('click', (e) => {
    e.preventDefault();
    showBanner();
    showSettings();
  });

  if (!consent) {
    // First visit — show banner, block everything
    showBanner();
    return;
  }

  // Returning visitor with saved preferences
  if (consent.analytics) {
    loadYandexMetrika();
  }
}

// Support Astro page transitions
document.addEventListener('astro:page-load', initCookieConsent);
initCookieConsent();
