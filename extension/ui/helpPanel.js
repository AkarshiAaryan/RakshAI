// Help & Indian Crisis Resources Panel Component

import { getTranslation } from '../locales/strings.js';

export function openHelpPanel(lang) {
  // Remove any pre-existing modal
  const existing = document.getElementById('rakshai-help-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'rakshai-help-modal';
  overlay.className = 'rakshai-modal-overlay rakshai-reset';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'rakshai-help-title');

  overlay.innerHTML = `
    <div class="rakshai-modal-card">
      <div class="rakshai-modal-header">
        <div class="rakshai-modal-icon" style="background: #e0f2fe; color: #0284c7;">
          🛡️
        </div>
        <div style="flex: 1;">
          <h2 id="rakshai-help-title" class="rakshai-modal-title">${getTranslation(lang, 'helpPanelTitle')}</h2>
          <p class="rakshai-modal-desc">${getTranslation(lang, 'helpPanelSubtitle')}</p>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; max-height: 320px; overflow-y: auto;">
        <div class="rakshai-helpline-card">
          <strong>${getTranslation(lang, 'helplineChildlineTitle')}</strong>
          <p>${getTranslation(lang, 'helplineChildlineDesc')}</p>
        </div>
        <div class="rakshai-helpline-card">
          <strong>${getTranslation(lang, 'helplineIcallTitle')}</strong>
          <p>${getTranslation(lang, 'helplineIcallDesc')}</p>
        </div>
        <div class="rakshai-helpline-card">
          <strong>${getTranslation(lang, 'helplineVandrevalaTitle')}</strong>
          <p>${getTranslation(lang, 'helplineVandrevalaDesc')}</p>
        </div>
        <div class="rakshai-helpline-card">
          <strong>${getTranslation(lang, 'helplineAdultTitle')}</strong>
          <p>${getTranslation(lang, 'helplineAdultDesc')}</p>
        </div>
      </div>

      <div class="rakshai-btn-row" style="justify-content: flex-end;">
        <button id="rakshai-help-close-btn" class="rakshai-btn rakshai-btn-secondary" style="min-width: 100px;">
          ${getTranslation(lang, 'close')}
        </button>
      </div>
    </div>
  `;

  function closeModal() {
    overlay.remove();
    document.removeEventListener('keydown', handleKeyDown);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  overlay.querySelector('#rakshai-help-close-btn').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', handleKeyDown);
  document.body.appendChild(overlay);

  // Focus close button
  setTimeout(() => {
    const btn = overlay.querySelector('#rakshai-help-close-btn');
    if (btn) btn.focus();
  }, 50);
}
