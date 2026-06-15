const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxN71K8WFzySZTvBidkhLRvIlkWhakzG3lC5nt1FAXuYVV_lsBaNM2R-NH9OPY9vVEEGA/exec';

let activeFileId = null;

// ── Form refs (declared early — used in openModal) ────────────────────────────
const form       = document.getElementById('download-form');
const submitBtn  = document.getElementById('submit-btn');
const btnText    = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const alertArea  = document.getElementById('alert-area');

// ── Modal ─────────────────────────────────────────────────────────────────────
const downloadBodyTitle = document.getElementById('downloadModalBodyTitle');
let bsModal = null;

function openModal(index) {
  const wp = WHITEPAPERS[index];
  activeFileId = wp.fileId;
  downloadBodyTitle.textContent = wp.title;
  alertArea.innerHTML = '';
  form.reset();
  ['firstName', 'lastName', 'company', 'email'].forEach(name =>
    form.elements[name].classList.remove('is-invalid')
  );
  if (!bsModal) bsModal = new bootstrap.Modal(document.getElementById('downloadModal'));
  bsModal.show();
}

// ── Whitepaper cards ──────────────────────────────────────────────────────────
function renderWhitepapers() {
  const list = document.getElementById('whitepaperList');
  if (!list) return;

  list.innerHTML = WHITEPAPERS.map((wp, i) => `
    <article class="whitepaper-card">
      <p class="eyebrow wp-topic">${wp.topic}</p>
      <h3>${wp.title}</h3>
      <p>${wp.summary}</p>
      <button class="btn btn-primary" data-wp-index="${i}">Download</button>
    </article>
  `).join('');

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-wp-index]');
    if (!btn) return;
    openModal(parseInt(btn.dataset.wpIndex, 10));
  });
}

// ── Form handling ─────────────────────────────────────────────────────────────
function showAlert(type, message) {
  alertArea.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnText.textContent = isLoading ? 'Submitting…' : 'Download Now';
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
  };

  if (!validateForm(data)) return;

  setLoading(true);

  try {
    await submitForm(data);
    const downloadUrl = `https://docs.google.com/uc?export=download&id=${activeFileId}`;
    setTimeout(() => window.open(downloadUrl, '_blank'), 1000);
    showAlert('success', 'Your download is starting — check your browser!');
    form.reset();
    ['firstName', 'lastName', 'company', 'email'].forEach(name =>
      form.elements[name].classList.remove('is-invalid')
    );
  } catch (err) {
    showAlert('danger', 'Something went wrong. Please try again or contact us directly.');
  } finally {
    setLoading(false);
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderWhitepapers();
