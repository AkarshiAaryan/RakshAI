// Injected Response Safety Banner Component

import { getTranslation } from '../locales/strings.js';

/**
 * Attaches a non-destructive safety warning banner to an assistant response element.
 * @param {HTMLElement} responseElement - The DOM node representing the assistant message
 * @param {string} lang - Active language code
 * @param {Object} riskDetails - Matched risk rule info
 * @param {Function} onGetHelp - Callback to open the help resources panel
 */
export function attachResponseBanner(responseElement, lang, riskDetails, onGetHelp) {
  if (!responseElement || responseElement.querySelector('.rakshai-response-banner')) {
    return; // Already attached
  }

  const banner = document.createElement('div');
  banner.className = 'rakshai-response-banner rakshai-reset';
  banner.setAttribute('role', 'alert');

  banner.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 16px;">⚠️</span>
      <div>
        <strong style="color: #78350f;">${getTranslation(lang, 'responseWarningTitle')}</strong>
        <p style="margin: 2px 0 0 0; color: #92400e; font-size: 11px;">
          ${getTranslation(lang, 'responseWarningNotice')}
        </p>
      </div>
    </div>
    <div class="rakshai-response-banner-actions">
      <button class="rakshai-banner-btn rakshai-banner-help-btn">
        ${getTranslation(lang, 'btnGetHelp')}
      </button>
      <button class="rakshai-banner-btn rakshai-banner-dismiss-btn" style="border-color: #cbd5e1; color: #64748b;">
        ✕ ${getTranslation(lang, 'btnDismiss')}
      </button>
    </div>
  `;

  banner.querySelector('.rakshai-banner-help-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (typeof onGetHelp === 'function') {
      onGetHelp();
    }
  });

  banner.querySelector('.rakshai-banner-dismiss-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    banner.remove();
  });

  // Prepend to response element so warning is immediately visible above content
  responseElement.prepend(banner);
  return banner;
}
