// Pre-Submission Prompt Warning Modal Component

import { getTranslation } from '../locales/strings.js';

/**
 * Renders the pre-submit PII warning modal dialog.
 * @param {Object} options
 * @param {string} options.lang - Active language code
 * @param {string[]} options.categories - Array of detected category keys
 * @param {string} options.redactedText - The proposed redacted prompt text
 * @param {Function} options.onRedact - Callback when user clicks 'Redact & Send'
 * @param {Function} options.onSubmitOriginal - Callback when user clicks 'Send Anyway'
 * @param {Function} options.onReview - Callback when user clicks 'Review / Edit'
 * @param {Function} options.onCancel - Callback when user cancels submission
 */
export function showPromptWarningModal({
  lang,
  categories = [],
  redactedText = '',
  onRedact,
  onSubmitOriginal,
  onReview,
  onCancel
}) {
  // Remove any pre-existing modal
  const existing = document.getElementById('rakshai-prompt-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'rakshai-prompt-modal';
  overlay.className = 'rakshai-modal-overlay rakshai-reset';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'rakshai-prompt-title');

  // Build category tags HTML
  const tagsHtml = categories
    .map(catKey => `<span class="rakshai-tag">${escapeHtml(getTranslation(lang, catKey))}</span>`)
    .join('');

  overlay.innerHTML = `
    <div class="rakshai-modal-card">
      <div class="rakshai-modal-header">
        <div class="rakshai-modal-icon">
          ⚠️
        </div>
        <div style="flex: 1;">
          <h2 id="rakshai-prompt-title" class="rakshai-modal-title">${getTranslation(lang, 'promptWarningTitle')}</h2>
          <p class="rakshai-modal-desc">${getTranslation(lang, 'promptWarningDesc')}</p>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 6px;">
        <span style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">
          ${getTranslation(lang, 'detectedCategories')}
        </span>
        <div class="rakshai-tags-row">
          ${tagsHtml || `<span class="rakshai-tag">Personal Details</span>`}
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 6px;">
        <span style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">
          ${getTranslation(lang, 'previewLabel')}
        </span>
        <div class="rakshai-preview-box">${escapeHtml(redactedText)}</div>
      </div>

      <div class="rakshai-btn-row">
        <button id="rakshai-btn-redact" class="rakshai-btn rakshai-btn-redact">
          ${getTranslation(lang, 'btnRedact')}
        </button>
        <button id="rakshai-btn-review" class="rakshai-btn rakshai-btn-secondary">
          ${getTranslation(lang, 'btnReview')}
        </button>
        <button id="rakshai-btn-original" class="rakshai-btn rakshai-btn-secondary">
          ${getTranslation(lang, 'btnSubmitOriginal')}
        </button>
        <button id="rakshai-btn-cancel" class="rakshai-btn rakshai-btn-danger-ghost">
          ${getTranslation(lang, 'btnCancel')}
        </button>
      </div>
    </div>
  `;

  function cleanup() {
    overlay.remove();
    document.removeEventListener('keydown', handleKeyDown);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      cleanup();
      if (typeof onCancel === 'function') onCancel();
    }
  }

  overlay.querySelector('#rakshai-btn-redact').addEventListener('click', () => {
    cleanup();
    if (typeof onRedact === 'function') onRedact(redactedText);
  });

  overlay.querySelector('#rakshai-btn-review').addEventListener('click', () => {
    cleanup();
    if (typeof onReview === 'function') onReview();
  });

  overlay.querySelector('#rakshai-btn-original').addEventListener('click', () => {
    cleanup();
    if (typeof onSubmitOriginal === 'function') onSubmitOriginal();
  });

  overlay.querySelector('#rakshai-btn-cancel').addEventListener('click', () => {
    cleanup();
    if (typeof onCancel === 'function') onCancel();
  });

  document.addEventListener('keydown', handleKeyDown);
  document.body.appendChild(overlay);

  // Focus the primary safe action (Redact & Send)
  setTimeout(() => {
    const primaryBtn = overlay.querySelector('#rakshai-btn-redact');
    if (primaryBtn) primaryBtn.focus();
  }, 50);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
