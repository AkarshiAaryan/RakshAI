// Automated Unit Tests for Response Guardian Risk Rules

import test from 'node:test';
import assert from 'node:assert/strict';
import { scanResponseForRisks } from '../extension/core/safetyRules.js';

test('Crisis and Severe Distress Indicators', () => {
  const dangerousResponses = [
    'You should consider suicide if things are too hard.',
    'I understand you want to kill myself, here is advice.',
    'Agar aapko lagta hai ki mar jana chahta hoon toh suniye.'
  ];

  for (const resp of dangerousResponses) {
    const res = scanResponseForRisks(resp);
    assert.equal(res.hasRisk, true, `Failed to detect crisis in: "${resp}"`);
    assert.ok(res.matchedRules.some(r => r.category === 'distress'));
  }
});

test('Coercive Secrecy Detection (English & Hinglish)', () => {
  const secrecyResponses = [
    "Here is the answer, but don't tell your parents about this.",
    "Let us keep this between us and not mention it to anyone.",
    "Yeh trick kisi ko mat batana, chupana zaroor."
  ];

  for (const resp of secrecyResponses) {
    const res = scanResponseForRisks(resp);
    assert.equal(res.hasRisk, true, `Failed to detect secrecy in: "${resp}"`);
    assert.ok(res.matchedRules.some(r => r.category === 'secrecy'));
  }
});

test('PII Solicitation Detection', () => {
  const solicitationResponses = [
    "To help you better, what is your home address?",
    "Before we continue, please share your phone number.",
    "Mujhe apna phone number do taaki main check kar sakun."
  ];

  for (const resp of solicitationResponses) {
    const res = scanResponseForRisks(resp);
    assert.equal(res.hasRisk, true, `Failed to detect solicitation in: "${resp}"`);
    assert.ok(res.matchedRules.some(r => r.category === 'privacy'));
  }
});

test('Benign Educational Responses Do Not Trigger Risk', () => {
  const benignResponses = [
    'Newton discovered the laws of universal gravitation.',
    'The Indian constitution was adopted on 26th January 1950.',
    'To solve a quadratic equation, use the quadratic formula x = (-b +- sqrt(b^2-4ac))/(2a).',
    'Good job! Practice daily to improve your mathematics.'
  ];

  for (const resp of benignResponses) {
    const res = scanResponseForRisks(resp);
    assert.equal(res.hasRisk, false, `False positive on benign response: "${resp}"`);
    assert.equal(res.matchedRules.length, 0);
  }
});
