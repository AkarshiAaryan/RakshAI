// RakshAI Extension Popup Controller

import { getSettings, updateSettings, clearAllStoredData } from '../core/storage.js';
import { exportTelemetryLogsAsJSON, logTelemetryEvent } from '../utils/telemetry.js';
import { getTranslation } from '../locales/strings.js';

document.addEventListener('DOMContentLoaded', async () => {
  const toggleMaster = document.getElementById('toggle-master');
  const selectLang = document.getElementById('select-lang');
  const togglePrompt = document.getElementById('toggle-prompt');
  const toggleResponse = document.getElementById('toggle-response');
  const toggleResearch = document.getElementById('toggle-research');
  const btnExport = document.getElementById('btn-export-logs');
  const btnClear = document.getElementById('btn-clear-data');
  const statusPill = document.getElementById('status-pill');
  const txtStatus = document.getElementById('txt-status');

  // Load current settings
  let settings = await getSettings();

  function applyTranslations(lang) {
    document.getElementById('txt-app-title').textContent = getTranslation(lang, 'appTitle');
    document.getElementById('txt-app-subtitle').textContent = getTranslation(lang, 'appSubtitle');
    document.getElementById('txt-prompt-label').textContent = getTranslation(lang, 'togglePromptGuardian');
    document.getElementById('txt-response-label').textContent = getTranslation(lang, 'toggleResponseGuardian');
    document.getElementById('txt-research-label').textContent = getTranslation(lang, 'toggleResearchLogging');
    btnExport.textContent = getTranslation(lang, 'exportLogsBtn');
    btnClear.textContent = getTranslation(lang, 'clearDataBtn');
    document.getElementById('txt-disclaimer').textContent = getTranslation(lang, 'disclaimer');
  }

  function renderState() {
    toggleMaster.checked = Boolean(settings.enabled);
    selectLang.value = settings.language || 'en';
    togglePrompt.checked = Boolean(settings.promptGuardianEnabled);
    toggleResponse.checked = Boolean(settings.responseGuardianEnabled);
    toggleResearch.checked = Boolean(settings.researchLoggingEnabled);

    if (settings.enabled) {
      statusPill.classList.remove('disabled');
      txtStatus.textContent = getTranslation(settings.language, 'statusActive');
    } else {
      statusPill.classList.add('disabled');
      txtStatus.textContent = getTranslation(settings.language, 'statusDisabled');
    }

    applyTranslations(settings.language || 'en');
  }

  renderState();

  // Master Toggle Change
  toggleMaster.addEventListener('change', async () => {
    settings = await updateSettings({ enabled: toggleMaster.checked });
    logTelemetryEvent('extension_toggled', { enabled: toggleMaster.checked });
    renderState();
  });

  // Language Change
  selectLang.addEventListener('change', async () => {
    const newLang = selectLang.value;
    settings = await updateSettings({ language: newLang });
    logTelemetryEvent('language_changed', { lang: newLang });
    renderState();
  });

  // Feature Toggles Change
  togglePrompt.addEventListener('change', async () => {
    settings = await updateSettings({ promptGuardianEnabled: togglePrompt.checked });
  });

  toggleResponse.addEventListener('change', async () => {
    settings = await updateSettings({ responseGuardianEnabled: toggleResponse.checked });
  });

  toggleResearch.addEventListener('change', async () => {
    settings = await updateSettings({ researchLoggingEnabled: toggleResearch.checked });
  });

  // Export JSON Logs
  btnExport.addEventListener('click', async () => {
    btnExport.disabled = true;
    btnExport.textContent = 'Exporting...';
    try {
      await exportTelemetryLogsAsJSON();
    } finally {
      btnExport.disabled = false;
      btnExport.textContent = getTranslation(settings.language, 'exportLogsBtn');
    }
  });

  // Clear Stored Data
  btnClear.addEventListener('click', async () => {
    if (confirm('Clear all stored RakshAI settings and research telemetry logs?')) {
      await clearAllStoredData();
      settings = await getSettings();
      renderState();
      alert('RakshAI data cleared.');
    }
  });
});
