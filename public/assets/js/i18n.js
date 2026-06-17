function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
    || (TRANSLATIONS.en && TRANSLATIONS.en[key])
    || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
    el.setAttribute('title', t(el.dataset.i18nTitle));
  });
  const langMeta = { en: { flag: 'fi-gb', label: 'EN' }, fr: { flag: 'fi-fr', label: 'FR' } };
  const meta = langMeta[currentLang] || langMeta.en;
  const flagEl = document.getElementById('lang-flag');
  const labelEl = document.getElementById('lang-label');
  if (flagEl) flagEl.className = 'fi ' + meta.flag;
  if (labelEl) labelEl.textContent = meta.label;
  ['en', 'fr'].forEach(function (lang) {
    const checkEl = document.getElementById('lang-check-' + lang);
    if (checkEl) checkEl.classList.toggle('d-none', lang !== currentLang);
  });
  document.documentElement.lang = currentLang;
}

function setLanguage(lang) {
  currentLang = lang;
  const url = new URL(window.location);
  url.searchParams.set('lang', lang);
  history.replaceState(null, '', url);
  applyTranslations();
}

(function () {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang');
  const browserLang = navigator.language.startsWith('fr') ? 'fr' : 'en';
  currentLang = (urlLang === 'en' || urlLang === 'fr') ? urlLang
    : browserLang;
  const url = new URL(window.location);
  url.searchParams.set('lang', currentLang);
  history.replaceState(null, '', url);
})();

document.addEventListener('DOMContentLoaded', applyTranslations);
