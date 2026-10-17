// RakshAI Extension Content Script Entry Point

import { adapterRegistry } from '../adapters/adapterRegistry.js';
import { getSettings } from '../core/storage.js';
import { UIManager } from '../ui/injectedUI.js';
import { PromptGuardian } from '../core/promptGuardian.js';
import { ResponseGuardian } from '../core/responseGuardian.js';
import { logTelemetryEvent } from '../utils/telemetry.js';

(async function initRakshAI() {
  console.log('[RakshAI] Initializing browser safety extension...');

  // 1. Match current website with an adapter
  const adapter = adapterRegistry.getAdapterForUrl(window.location.href);
  if (!adapter) {
    console.log('[RakshAI] Active site is not a supported chatbot interface. Standing by.');
    return;
  }

  console.log(`[RakshAI] Site adapter active: ${adapter.name}`);

  // 2. Load stored settings
  const settings = await getSettings();

  // 3. Initialize UI Manager
  const uiManager = new UIManager(settings.language || 'en');

  // 4. Mount persistent AI identity badge if enabled
  if (settings.enabled) {
    uiManager.mountIdentityBadge();
  }

  // 5. Initialize & start Prompt Guardian
  const promptGuardian = new PromptGuardian(adapter, uiManager, settings);
  if (settings.enabled && settings.promptGuardianEnabled) {
    promptGuardian.start();
  }

  // 6. Initialize & start Response Guardian
  const responseGuardian = new ResponseGuardian(adapter, uiManager, settings);
  if (settings.enabled && settings.responseGuardianEnabled) {
    responseGuardian.start();
  }

  // 7. Log initialization telemetry event
  logTelemetryEvent('extension_initialized', {
    adapterName: adapter.name,
    lang: settings.language
  });

  // 8. Listen for live settings changes from the popup
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes.rakshai_settings) {
        const updated = changes.rakshai_settings.newValue || {};
        console.log('[RakshAI] Settings updated dynamically:', updated);

        uiManager.setLanguage(updated.language || 'en');
        promptGuardian.updateSettings(updated);
        responseGuardian.updateSettings(updated);

        if (updated.enabled) {
          uiManager.mountIdentityBadge();
          if (updated.promptGuardianEnabled) promptGuardian.start();
          else promptGuardian.stop();

          if (updated.responseGuardianEnabled) responseGuardian.start();
          else responseGuardian.stop();
        } else {
          promptGuardian.stop();
          responseGuardian.stop();
          const badge = document.getElementById('rakshai-identity-container');
          if (badge) badge.remove();
        }
      }
    });
  }
})();
