const DEPLOYMENT_ID = "AKfycbzrF-vwmovqv0taB9Si3A7UUlY5B9-QyipKsKQLrCLOt8G51AD6iKeWCQvCV9cwRmI9JA";
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrF-vwmovqv0taB9Si3A7UUlY5B9-QyipKsKQLrCLOt8G51AD6iKeWCQvCV9cwRmI9JA/exec';

let activeFilePath = null;

// ── Form refs (declared early — used in openModal) ────────────────────────────
const form       = document.getElementById('download-form');
const submitBtn  = document.getElementById('submit-btn');
const btnText    = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const alertArea  = document.getElementById('alert-area');

// ── Modal ─────────────────────────────────────────────────────────────────────
const downloadBodyTitle = document.getElementById('downloadModalBodyTitle');
let bsModal = null;

function openModal(id) {
  const wp = WHITEPAPERS.find(w => w.id === id);
  const locale = wp.locales[currentLang] ?? wp.locales.en;
  activeFilePath = locale.filePath;
  downloadBodyTitle.setAttribute('data-i18n', 'whitepapers.' + id + '.title');
  applyTranslations();
  alertArea.innerHTML = '';
  form.reset();
  ['firstName', 'lastName', 'company', 'email'].forEach(name =>
    form.elements[name].classList.remove('is-invalid')
  );
  form.elements.consent.checked = true;
  if (!bsModal) bsModal = new bootstrap.Modal(document.getElementById('downloadModal'));
  bsModal.show();
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

  ['firstName', 'lastName', 'company', 'email'].forEach(name => {
    const input = form.elements[name];
    const empty = !data[name].trim();
    const badEmail = name === 'email' && !empty && !validateEmail(data[name]);

    if (empty || badEmail) {
      input.classList.add('is-invalid');
      valid = false;
    } else {
      input.classList.remove('is-invalid');
    }
  });

  return valid;
}

async function submitForm(data) {
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: new URLSearchParams(data),
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  alertArea.innerHTML = '';

  const data = {
    firstName: form.elements.firstName.value,
    lastName:  form.elements.lastName.value,
    company:   form.elements.company.value,
    email:     form.elements.email.value,
    consent:   form.elements.consent.checked,
  };

  if (!validateForm(data)) return;

  setLoading(true);

  try {
    await submitForm(data);
    setTimeout(async () => {
      const res = await fetch(activeFilePath);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = activeFilePath.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 1000);
    showAlert('success', t('alert.success'));
    form.reset();
    ['firstName', 'lastName', 'company', 'email'].forEach(name =>
      form.elements[name].classList.remove('is-invalid')
    );
  } catch (err) {
    showAlert('danger', t('alert.error'));
  } finally {
    setLoading(false);
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderWhitepapers();
