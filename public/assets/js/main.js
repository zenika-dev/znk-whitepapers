let activeWhitepaperId = null;

// ── Form refs (declared early — used in openModal) ────────────────────────────
const forms = [
    document.getElementById('download-form-en'),
    document.getElementById('download-form-fr')
].filter(Boolean);
const submitBtn  = document.getElementById('submit-btn');
const btnText    = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const alertArea  = document.getElementById('alert-area');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const consentInput = document.getElementById('consent');
const emailFrInput = document.getElementById('email-fr');

// ── Modal ─────────────────────────────────────────────────────────────────────
const downloadBodyTitle = document.getElementById('downloadModalBodyTitle');
let bsModal = null;

function openModal(id) {
  const wp = WHITEPAPERS.find(w => w.id === id);
  activeWhitepaperId = wp?.id ?? null;
  downloadBodyTitle.setAttribute('data-i18n', 'whitepapers.' + id + '.title');
  applyTranslations();
  alertArea.innerHTML = '';
  const activeForm = currentLang === 'fr'
    ? document.getElementById('download-form-fr')
    : document.getElementById('download-form-en');
  activeForm?.reset();
  [fullNameInput, emailInput, emailFrInput].forEach(input =>
    input?.classList.remove('is-invalid')
  );
  if (consentInput) consentInput.checked = true;
  if (!bsModal) bsModal = new bootstrap.Modal(document.getElementById('downloadModal'));
  bsModal.show();
}

// ── Whitepaper cards ──────────────────────────────────────────────────────────
function renderWhitepapers() {
  const list = document.getElementById('whitepaperList');
  if (!list) return;

  list.innerHTML = WHITEPAPERS.map((wp) => {
    const cover = wp.covers?.[currentLang] || wp.covers?.en;
    const hasDetail = !!wp.locales?.en?.detail;
    return `
    <article class="whitepaper-card">
      ${cover ? `
      <button class="wp-card-cover-btn" type="button" ${hasDetail ? `data-wp-read="${wp.id}"` : `data-wp-id="${wp.id}"`} tabindex="-1" aria-hidden="true">
        <img class="wp-card-cover" src="${cover}" alt="" />
      </button>` : ''}
      <div class="wp-card-body">
        <p class="eyebrow wp-topic" data-i18n="whitepapers.${wp.id}.topic"></p>
        <h3 data-i18n="whitepapers.${wp.id}.title"></h3>
        <div class="card-actions">
          ${hasDetail ? `<button class="btn btn-outline-secondary" data-wp-read="${wp.id}" data-i18n="card.readMore">Read preview</button>` : ''}
          <button class="btn btn-primary" data-wp-id="${wp.id}" data-i18n="card.download">Download</button>
        </div>
      </div>
    </article>`;
  }).join('');
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
  const { wp, d } = data;

  const cover = wp.covers?.[currentLang] || wp.covers?.en;

  const takeaways = (d.takeaways || []).map((t) => `
    <li class="detail-takeaway">
      <span class="detail-takeaway-num" aria-hidden="true"></span>
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

      <div class="detail-layout">
        <div class="detail-main">
          <header class="detail-head-copy">
            <p class="eyebrow" data-i18n="whitepapers.${id}.topic"></p>
            <h1 data-i18n="whitepapers.${id}.title"></h1>
            ${d.published ? `<p class="detail-meta">${escapeHtml(d.published)}</p>` : ''}
            <p class="detail-lead">${escapeHtml(d.lead)}</p>
            ${d.ship ? `<p class="detail-ship">${escapeHtml(d.ship)}</p>` : ''}
            <div class="detail-head-cta">
              <button class="btn btn-primary" type="button" data-wp-id="${id}" data-i18n="detail.cta">Download the full whitepaper</button>
              <p class="detail-cta-note" data-i18n="detail.ctaNote"></p>
            </div>
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
        </div>

        ${cover ? `
        <aside class="detail-sidebar">
          <button class="detail-cover-wrap" type="button" data-wp-id="${id}" aria-label="Download this whitepaper">
            <img class="detail-cover" src="${escapeHtml(cover)}" alt="" aria-hidden="true" />
            <span class="detail-cover-hint" data-i18n="detail.cta">Download the full whitepaper</span>
          </button>
        </aside>` : ''}
      </div>
    </div>`;

  detailSection.querySelectorAll('#detail-back')
    .forEach(el => el.addEventListener('click', () => closeDetail()));
  detailSection.querySelectorAll('[data-wp-id]')
    .forEach(el => el.addEventListener('click', (e) => openModal(e.currentTarget.dataset.wpId)));

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
  else renderWhitepapers();
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

function validateEnglishForm() {
  let valid = true;

  const nameEmpty = !fullNameInput.value.trim();
  if (nameEmpty) {
    fullNameInput.classList.add('is-invalid');
    valid = false;
  } else {
    fullNameInput.classList.remove('is-invalid');
  }

  const emailValue = emailInput.value;
  const emailEmpty = !emailValue.trim();
  const emailBad = !emailEmpty && !validateEmail(emailValue);
  if (emailEmpty || emailBad) {
    emailInput.classList.add('is-invalid');
    valid = false;
  } else {
    emailInput.classList.remove('is-invalid');
  }

  return valid;
}

function validateFrenchForm() {
  const emailValue = emailFrInput.value;
  const emailEmpty = !emailValue.trim();
  const emailBad = !emailEmpty && !validateEmail(emailValue);

  if (emailEmpty || emailBad) {
    emailFrInput.classList.add('is-invalid');
    return false;
  }
  emailFrInput.classList.remove('is-invalid');
  return true;
}

forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertArea.innerHTML = '';

      const isEnglish = form.id === 'download-form-en';
      const valid = isEnglish ? validateEnglishForm() : validateFrenchForm();

      if (!valid) return;

      setLoading(true);

      try {
        form.elements.locale.value = currentLang;

        form.submit();
        showAlert('success', t('alert.success'));
        form.reset();
        [fullNameInput, emailInput, emailFrInput].forEach(input =>
          input?.classList.remove('is-invalid')
        );
      } catch (err) {
        showAlert('danger', t('alert.error'));
      } finally {
        setLoading(false);
      }
    });
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderWhitepapers();
syncDetailFromUrl(false);
