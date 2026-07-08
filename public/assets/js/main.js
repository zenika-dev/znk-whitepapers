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
const jobTitleInput = document.getElementById('jobTitle');
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
  [firstNameInput, lastNameInput, companyInput, jobTitleInput, emailInput].forEach(input =>
    input.classList.remove('is-invalid')
  );
  consentInput.checked = true;
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
      <div class="card-actions">
        ${wp.locales?.en?.detail ? `<button class="btn btn-outline-secondary" data-wp-read="${wp.id}" data-i18n="card.readMore">Read preview</button>` : ''}
        <button class="btn btn-primary" data-wp-id="${wp.id}" data-i18n="card.download">Download</button>
      </div>
    </article>
  `).join('');
  applyTranslations();

  list.addEventListener('click', (e) => {
    const readBtn = e.target.closest('[data-wp-read]');
    if (readBtn) {
      openDetail(readBtn.dataset.wpRead);
      return;
    }
    const btn = e.target.closest('[data-wp-id]');
    if (!btn) return;
    openModal(btn.dataset.wpId);
  });
}

// ── Detail / preview view ─────────────────────────────────────────────────────
const gridSection   = document.getElementById('whitepapers');
const heroSection   = document.querySelector('.hero');
const detailSection = document.getElementById('whitepaperDetail');
let activeDetailId  = null;

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function detailData(id) {
  const wp = WHITEPAPERS.find(w => w.id === id);
  if (!wp) return null;
  const locale = wp.locales[currentLang] || wp.locales.en;
  return locale.detail ? { wp, locale, d: locale.detail } : null;
}

function renderDetail(id) {
  const data = detailData(id);
  if (!detailSection || !data) return false;
  const { d } = data;

  const takeaways = (d.takeaways || []).map((t) => `
    <li class="detail-takeaway">
      <span class="detail-takeaway-icon" aria-hidden="true">${escapeHtml(t.icon || '•')}</span>
      <div>
        <h3>${escapeHtml(t.title)}</h3>
        <p>${escapeHtml(t.text)}</p>
      </div>
    </li>`).join('');

  const stats = (d.stats || []).map((s) => `
    <div class="detail-stat">
      <span class="detail-stat-value">${escapeHtml(s.value)}</span>
      <span class="detail-stat-label">${escapeHtml(s.label)}</span>
      ${s.source ? `<span class="detail-stat-source">${escapeHtml(s.source)}</span>` : ''}
    </div>`).join('');

  detailSection.innerHTML = `
    <div class="container detail-shell">
      <button class="btn btn-link detail-back" type="button" id="detail-back">
        <span aria-hidden="true">←</span> <span data-i18n="detail.back">Back to whitepapers</span>
      </button>

      <header class="detail-head">
        <p class="eyebrow" data-i18n="whitepapers.${id}.topic"></p>
        <h1 data-i18n="whitepapers.${id}.title"></h1>
        ${d.published ? `<p class="detail-meta">${escapeHtml(d.published)}</p>` : ''}
        <p class="detail-lead">${escapeHtml(d.lead)}</p>
        ${d.ship ? `<p class="detail-ship">${escapeHtml(d.ship)}</p>` : ''}
      </header>

      ${d.quote ? `<blockquote class="detail-quote">${escapeHtml(d.quote)}</blockquote>` : ''}

      ${takeaways ? `
      <section class="detail-block">
        <h2 data-i18n="detail.takeawaysTitle">What you'll learn</h2>
        <ul class="detail-takeaways">${takeaways}</ul>
      </section>` : ''}

      ${stats ? `
      <section class="detail-block">
        <h2 data-i18n="detail.statsTitle">By the numbers</h2>
        <div class="detail-stats">${stats}</div>
      </section>` : ''}

      <div class="detail-cta">
        <button class="btn btn-primary" type="button" data-wp-id="${id}" data-i18n="detail.cta">Download the full whitepaper</button>
        <p class="detail-cta-note" data-i18n="detail.ctaNote"></p>
      </div>
    </div>`;

  detailSection.querySelector('#detail-back')
    .addEventListener('click', () => closeDetail());
  detailSection.querySelector('[data-wp-id]')
    .addEventListener('click', (e) => openModal(e.currentTarget.dataset.wpId));

  applyTranslations();
  return true;
}

function showDetailView(show) {
  detailSection.hidden = !show;
  if (heroSection) heroSection.hidden = show;
  if (gridSection) gridSection.hidden = show;
}

function openDetail(id, { push = true } = {}) {
  if (!renderDetail(id)) return;
  activeDetailId = id;
  showDetailView(true);
  if (push) {
    const url = new URL(window.location);
    url.searchParams.set('paper', id);
    history.pushState({ paper: id }, '', url);
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
  document.getElementById('detail-back')?.focus();
}

function closeDetail({ push = true } = {}) {
  activeDetailId = null;
  showDetailView(false);
  if (detailSection) detailSection.innerHTML = '';
  if (push) {
    const url = new URL(window.location);
    url.searchParams.delete('paper');
    history.pushState({}, '', url);
  }
  document.getElementById('whitepapers')?.scrollIntoView({ behavior: 'auto', block: 'start' });
}

function syncDetailFromUrl(push) {
  const id = new URLSearchParams(window.location.search).get('paper');
  if (id && detailData(id)) {
    openDetail(id, { push });
  } else if (activeDetailId) {
    closeDetail({ push });
  }
}

window.addEventListener('popstate', () => syncDetailFromUrl(false));
document.addEventListener('langchange', () => {
  if (activeDetailId) renderDetail(activeDetailId);
});

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

  const data = {
    firstName: firstNameInput.value,
    lastName:  lastNameInput.value,
    company:   companyInput.value,
    job_title: jobTitleInput.value,
    email:     emailInput.value,
    consent:   consentInput.checked,
  };

  if (!validateForm(data)) return;

  setLoading(true);

  try {
    form.elements.OPT_IN.value = data.consent ? '1' : '0';

    form.submit();
    showAlert('success', t('alert.success'));
    form.reset();
    [firstNameInput, lastNameInput, companyInput, jobTitleInput, emailInput].forEach(input =>
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
syncDetailFromUrl(false);
