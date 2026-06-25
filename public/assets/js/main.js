let activeWhitepaperId = null;

// ── Form refs (declared early — used in openModal) ────────────────────────────
const form       = document.getElementById('download-form');
const submitBtn  = document.getElementById('submit-btn');
const btnText    = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const alertArea  = document.getElementById('alert-area');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const companyInput = document.getElementById('company');
const emailInput = document.getElementById('email');
const consentInput = document.getElementById('consent');

// ── Modal ─────────────────────────────────────────────────────────────────────
const downloadBodyTitle = document.getElementById('downloadModalBodyTitle');
let bsModal = null;

function openModal(id) {
  const wp = WHITEPAPERS.find(w => w.id === id);
  activeWhitepaperId = wp?.id ?? null;
  downloadBodyTitle.setAttribute('data-i18n', 'whitepapers.' + id + '.title');
  applyTranslations();
  alertArea.innerHTML = '';
  form.reset();
  [firstNameInput, lastNameInput, companyInput, emailInput].forEach(input =>
    input.classList.remove('is-invalid')
  );
  form.elements.downloadLanguage.value = (currentLang === 'fr' || currentLang === 'en') ? currentLang : 'en';
  consentInput.checked = true;
  if (!bsModal) bsModal = new bootstrap.Modal(document.getElementById('downloadModal'));
  bsModal.show();
}

function getFilePathForLanguage(lang) {
  const wp = WHITEPAPERS.find(w => w.id === activeWhitepaperId);
  if (!wp) return null;
  const locale = wp.locales[lang] ?? wp.locales.en;
  return locale?.filePath ?? null;
}

// ── Whitepaper cards ──────────────────────────────────────────────────────────
function renderWhitepapers() {
  const list = document.getElementById('whitepaperList');
  if (!list) return;

  list.innerHTML = WHITEPAPERS.map((wp) => `
    <article class="whitepaper-card">
      <p class="eyebrow wp-topic" data-i18n="whitepapers.${wp.id}.topic"></p>
      <h3 data-i18n="whitepapers.${wp.id}.title"></h3>
      <p data-i18n="whitepapers.${wp.id}.summary"></p>
      <button class="btn btn-primary" data-wp-id="${wp.id}" data-i18n="card.download">Download</button>
    </article>
  `).join('');
  applyTranslations();

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-wp-id]');
    if (!btn) return;
    openModal(btn.dataset.wpId);
  });
}

// ── Form handling ─────────────────────────────────────────────────────────────
function showAlert(type, message) {
  alertArea.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" data-i18n-aria="modal.close"></button>
    </div>`;
  applyTranslations();
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnText.textContent = t(isLoading ? 'modal.loading' : 'modal.submitBtn');
  btnSpinner.classList.toggle('d-none', !isLoading);
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateForm(data) {
  let valid = true;

  [
    [firstNameInput, data.firstName],
    [lastNameInput, data.lastName],
    [companyInput, data.company],
    [emailInput, data.email],
  ].forEach(([input, value], index) => {
    const field = ['firstName', 'lastName', 'company', 'email'][index];
    const empty = !value.trim();
    const badEmail = field === 'email' && !empty && !validateEmail(value);

    if (empty || badEmail) {
      input.classList.add('is-invalid');
      valid = false;
    } else {
      input.classList.remove('is-invalid');
    }
  });

  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  alertArea.innerHTML = '';
  const selectedLanguageCode = form.elements.downloadLanguage.value;

  const data = {
    firstName: firstNameInput.value,
    lastName:  lastNameInput.value,
    company:   companyInput.value,
    email:     emailInput.value,
    downloadLanguage: selectedLanguageCode,
    consent:   consentInput.checked,
  };

  if (!validateForm(data)) return;

  const filePath = getFilePathForLanguage(selectedLanguageCode);

  const downloadLanguageLabel = selectedLanguageCode === 'fr' ? 'French' : 'English';

  setLoading(true);

  try {
    form.elements.OPT_IN.value = data.consent ? '1' : '0';
    form.elements.DOWNLOAD_LANGUAGE.value = downloadLanguageLabel;
    form.elements.locale.value = selectedLanguageCode;

    form.submit();

    setTimeout(async () => {
      const res = await fetch(filePath);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filePath.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 1000);
    showAlert('success', t('alert.success'));
    form.reset();
    [firstNameInput, lastNameInput, companyInput, emailInput].forEach(input =>
      input.classList.remove('is-invalid')
    );
  } catch (err) {
    showAlert('danger', t('alert.error'));
  } finally {
    setLoading(false);
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderWhitepapers();
