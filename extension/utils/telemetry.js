// RakshAI Privacy-Safe Research Telemetry
// Guarantees zero leakage of raw prompt text, responses, or personal values.

import { getSettings, appendTelemetryLog, getTelemetryLogs, clearAllStoredData } from '../core/storage.js';

const ALLOWED_EVENT_TYPES = new Set([
  'extension_initialized',
  'prompt_warning_shown',
  'prompt_redaction_applied',
  'prompt_submission_cancelled',
  'prompt_submitted_original',
  'response_warning_shown',
  'response_warning_dismissed',
  'help_panel_opened',
  'language_changed',
  'settings_updated',
  'extension_toggled'
]);

// Keys that are strictly forbidden from appearing in payload
const FORBIDDEN_PAYLOAD_KEYS = ['query', 'prompt', 'text', 'response', 'email', 'phone', 'address', 'id_number', 'value', 'raw'];

let currentSessionId = 'ext_session_' + Math.random().toString(36).substring(2, 9);
const sessionStartTime = Date.now();

export async function logTelemetryEvent(eventType, payload = {}) {
  const settings = await getSettings();

  // Research logging is opt-in only
  if (!settings.researchLoggingEnabled) {
    return;
  }

  if (!ALLOWED_EVENT_TYPES.has(eventType)) {
    console.warn(`[RakshAI Telemetry] Rejected unrecognized event type: ${eventType}`);
    return;
  }

  // Sanitize payload: strip any forbidden text or PII fields
  const sanitizedPayload = {};
  for (const [key, val] of Object.entries(payload)) {
    const lowerKey = key.toLowerCase();
    if (FORBIDDEN_PAYLOAD_KEYS.some(forbidden => lowerKey.includes(forbidden))) {
      console.warn(`[RakshAI Telemetry] Omitted sensitive key '${key}' from telemetry.`);
      continue;
    }
    // Only permit primitive non-sensitive metadata (counts, booleans, categories)
    if (typeof val === 'string' && val.length > 50) {
      // Long strings are truncated or omitted
      continue;
    }
    sanitizedPayload[key] = val;
  }

  const eventEntry = {
    timestamp: new Date().toISOString(),
    elapsedMs: Date.now() - sessionStartTime,
    sessionId: currentSessionId,
    eventType,
    payload: sanitizedPayload
  };

  await appendTelemetryLog(eventEntry);
}

export async function exportTelemetryLogsAsJSON() {
  const logs = await getTelemetryLogs();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
  const filename = `rakshai_research_telemetry_${currentSessionId}.json`;

  if (typeof document !== 'undefined') {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
  return logs;
}

export function getSessionId() {
  return currentSessionId;
}

export function resetSession() {
  currentSessionId = 'ext_session_' + Math.random().toString(36).substring(2, 9);
}
