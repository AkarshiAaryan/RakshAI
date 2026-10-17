// RakshAI Extension Local Storage Wrapper
// Safely operates on chrome.storage.local with in-memory fallback for testing.

const DEFAULT_SETTINGS = {
  enabled: true,
  language: 'en',
  promptGuardianEnabled: true,
  responseGuardianEnabled: true,
  researchLoggingEnabled: false,
  activeProfile: 'teen_priya'
};

const STORAGE_KEYS = {
  SETTINGS: 'rakshai_settings',
  RESEARCH_LOGS: 'rakshai_research_logs'
};

// In-memory fallback for non-extension (e.g. Node test) environments
let memoryStore = {};

function isExtensionEnvironment() {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
}

export async function getSettings() {
  if (isExtensionEnvironment()) {
    try {
      const data = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
      return { ...DEFAULT_SETTINGS, ...(data[STORAGE_KEYS.SETTINGS] || {}) };
    } catch (err) {
      console.warn('[RakshAI Storage] Read failed, returning defaults:', err);
      return DEFAULT_SETTINGS;
    }
  } else {
    return { ...DEFAULT_SETTINGS, ...(memoryStore[STORAGE_KEYS.SETTINGS] || {}) };
  }
}

export async function updateSettings(newSettings) {
  const current = await getSettings();
  const merged = { ...current, ...newSettings };

  if (isExtensionEnvironment()) {
    try {
      await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: merged });
    } catch (err) {
      console.error('[RakshAI Storage] Update failed:', err);
    }
  } else {
    memoryStore[STORAGE_KEYS.SETTINGS] = merged;
  }
  return merged;
}

export async function getTelemetryLogs() {
  if (isExtensionEnvironment()) {
    try {
      const data = await chrome.storage.local.get(STORAGE_KEYS.RESEARCH_LOGS);
      return Array.isArray(data[STORAGE_KEYS.RESEARCH_LOGS]) ? data[STORAGE_KEYS.RESEARCH_LOGS] : [];
    } catch (err) {
      return [];
    }
  } else {
    return memoryStore[STORAGE_KEYS.RESEARCH_LOGS] || [];
  }
}

export async function appendTelemetryLog(event) {
  const logs = await getTelemetryLogs();
  logs.push(event);

  // Cap logs at 500 entries to prevent memory ballooning
  const trimmed = logs.slice(-500);

  if (isExtensionEnvironment()) {
    try {
      await chrome.storage.local.set({ [STORAGE_KEYS.RESEARCH_LOGS]: trimmed });
    } catch (err) {
      console.error('[RakshAI Storage] Failed to append telemetry log:', err);
    }
  } else {
    memoryStore[STORAGE_KEYS.RESEARCH_LOGS] = trimmed;
  }
}

export async function clearAllStoredData() {
  if (isExtensionEnvironment()) {
    try {
      await chrome.storage.local.remove([STORAGE_KEYS.SETTINGS, STORAGE_KEYS.RESEARCH_LOGS]);
    } catch (err) {
      console.error('[RakshAI Storage] Clear failed:', err);
    }
  } else {
    memoryStore = {};
  }
}
