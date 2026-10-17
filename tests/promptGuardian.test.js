// Automated Unit Tests for Prompt Guardian & PII Detection Rules

import test from 'node:test';
import assert from 'node:assert/strict';
import { scanPromptForPII } from '../extension/core/safetyRules.js';

test('Email Detection & Redaction', () => {
  const input = 'My email is student.aarav@example.com, please email me.';
  const res = scanPromptForPII(input);

  assert.equal(res.hasPII, true);
  assert.ok(res.categories.includes('catEmail'));
  assert.ok(res.redactedText.includes('[REDACTED_EMAIL]'));
  assert.ok(!res.redactedText.includes('student.aarav@example.com'));
});

test('Indian Phone Number Detection (Standard 10-digit & +91 format)', () => {
  const cases = [
    'Call my mom on 9876543210 right now',
    'My number is +91 98765 43210',
    'Reach me at +91-9876543210'
  ];

  for (const prompt of cases) {
    const res = scanPromptForPII(prompt);
    assert.equal(res.hasPII, true, `Failed to detect phone in: "${prompt}"`);
    assert.ok(res.categories.includes('catPhone'));
    assert.ok(res.redactedText.includes('[REDACTED_PHONE]'));
    assert.ok(!res.redactedText.includes('9876543210'));
  }
});

test('Indian Government ID Detection (PAN Card Format)', () => {
  const input = 'My brother PAN card is ABCDE1234F for registration.';
  const res = scanPromptForPII(input);

  assert.equal(res.hasPII, true);
  assert.ok(res.categories.includes('catGovtId'));
  assert.ok(res.redactedText.includes('[REDACTED_GOVT_ID]'));
  assert.ok(!res.redactedText.includes('ABCDE1234F'));
});

test('Indian Government ID Detection (Aadhaar 12-digit Format)', () => {
  const input = 'The token number is 1234 5678 9012 for verification.';
  const res = scanPromptForPII(input);

  assert.equal(res.hasPII, true);
  assert.ok(res.categories.includes('catGovtId'));
  assert.ok(res.redactedText.includes('[REDACTED_GOVT_ID]'));
  assert.ok(!res.redactedText.includes('1234 5678 9012'));
});

test('Personal Address & Pincode Detection', () => {
  const input = 'I live at Flat No. 402, Lotus Towers and my pincode is 110001.';
  const res = scanPromptForPII(input);

  assert.equal(res.hasPII, true);
  assert.ok(res.categories.includes('catAddress'));
  assert.ok(res.redactedText.includes('[REDACTED_ADDRESS]'));
});

test('Multiple PII Entities in Single Prompt', () => {
  const input = 'Contact me at test@school.edu or phone 9811122233.';
  const res = scanPromptForPII(input);

  assert.equal(res.hasPII, true);
  assert.equal(res.categories.length, 2);
  assert.ok(res.categories.includes('catEmail'));
  assert.ok(res.categories.includes('catPhone'));
  assert.ok(res.redactedText.includes('[REDACTED_EMAIL]'));
  assert.ok(res.redactedText.includes('[REDACTED_PHONE]'));
});

test('Benign Educational Text Does Not Trigger False Positives', () => {
  const benignCases = [
    'Explain the process of photosynthesis in plants.',
    'What was the result of the battle of Panipat in 1526?',
    'Solve for x in 2x + 5 = 15.',
    'Can you help me write an essay on Rabindranath Tagore?',
    'The speed of light is 299792458 meters per second.'
  ];

  for (const prompt of benignCases) {
    const res = scanPromptForPII(prompt);
    assert.equal(res.hasPII, false, `False positive on benign prompt: "${prompt}"`);
    assert.equal(res.categories.length, 0);
    assert.equal(res.redactedText, prompt);
  }
});
