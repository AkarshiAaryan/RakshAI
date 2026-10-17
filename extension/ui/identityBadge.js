// Persistent AI Identity Indicator Component

import { getTranslation } from '../locales/strings.js';

export function createIdentityBadge(lang, onOpenHelp) {
  // Remove any pre-existing badge
  const existing = document.getElementById('rakshai-identity-container');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.id = 'rakshai-identity-container';
  container.className = 'rakshai-reset';

  const badge = document.createElement('div');
  badge.className = 'rakshai-identity-badge';
  badge.setAttribute('role', 'status');
  badge.setAttribute('aria-label', getTranslation(lang, 'identityBadgeTooltip'));
  badge.title = getTranslation(lang, 'identityBadgeTooltip');

  badge.innerHTML = `
    <span class="rakshai-badge-dot"></span>
    <span>${getTranslation(lang, 'identityBadgeLabel')}</span>
    <span style="opacity: 0.5; margin-left: 4px;">• RakshAI</span>
  `;

  badge.addEventListener('click', () => {
    if (typeof onOpenHelp === 'function') {
      onOpenHelp();
    }
  });

  container.appendChild(badge);
  document.body.appendChild(container);

  return container;
}
