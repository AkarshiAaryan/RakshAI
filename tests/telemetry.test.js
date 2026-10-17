// Automated Unit Tests for Privacy-Preserving Telemetry

import test from 'node:test';
import assert from 'node:assert/strict';
import { logTelemetryEvent, exportTelemetryLogsAsJSON, resetSession } from '../extension/utils/telemetry.js';
import { getSettings, updateSettings, clearAllStoredData, getTelemetryLogs } from '../extension/core/storage.js';

test('Telemetry is disabled by default and logs nothing', async () => {
  await clearAllStoredData();
  await updateSettings({ researchLoggingEnabled: false });

  await logTelemetryEvent('prompt_warning_shown', { categoriesCount: 1 });
  const logs = await getTelemetryLogs();

  assert.equal(logs.length, 0, 'Telemetry logged data when disabled!');
});

test('Telemetry logs permitted events when enabled without raw user text', async () => {
  await clearAllStoredData();
  await updateSettings({ researchLoggingEnabled: true });

  // Attempt to log event with both allowed metadata and forbidden raw text
  await logTelemetryEvent('prompt_warning_shown', {
    categoriesCount: 2,
    prompt: 'SECRET UNREDACTED TEXT THAT SHOULD BE BLOCKED',
    phone: '9876543210',
    query: 'How to do bad things'
  });

  const logs = await getTelemetryLogs();
  assert.equal(logs.length, 1);

  const entry = logs[0];
  assert.equal(entry.eventType, 'prompt_warning_shown');
  assert.equal(entry.payload.categoriesCount, 2);

  // Assert strictly that forbidden raw text fields were stripped
  assert.equal(entry.payload.prompt, undefined, 'Raw prompt was leaked into telemetry!');
  assert.equal(entry.payload.phone, undefined, 'Raw phone number was leaked into telemetry!');
  assert.equal(entry.payload.query, undefined, 'Raw query was leaked into telemetry!');

  await clearAllStoredData();
});
