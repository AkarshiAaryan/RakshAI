// RakshAI Prompt Guardian — Pre-submission DOM Interception Engine

import { scanPromptForPII } from './safetyRules.js';
import { logTelemetryEvent } from '../utils/telemetry.js';

export class PromptGuardian {
  constructor(adapter, uiManager, settings) {
    this.adapter = adapter;
    this.uiManager = uiManager;
    this.settings = settings;
    this.bypassNextSubmission = false;
    this.isListening = false;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  start() {
    if (this.isListening) return;

    // Attach capture-phase event listeners to intercept before host page handlers
    document.addEventListener('keydown', this.handleKeyDown, true);
    document.addEventListener('click', this.handleClick, true);
    document.addEventListener('submit', this.handleSubmit, true);
    this.isListening = true;
  }

  stop() {
    if (!this.isListening) return;

    document.removeEventListener('keydown', this.handleKeyDown, true);
    document.removeEventListener('click', this.handleClick, true);
    document.removeEventListener('submit', this.handleSubmit, true);
    this.isListening = false;
  }

  handleKeyDown(event) {
    // Only intercept Enter key without Shift/Ctrl/Alt/Meta
    if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    // Verify focus is currently inside the adapter's input element
    const inputEl = this.adapter.getInputElement();
    if (!inputEl) return;

    const activeEl = document.activeElement;
    const isTargetInput = activeEl === inputEl || inputEl.contains(activeEl);

    if (isTargetInput) {
      this.evaluateSubmission(event);
    }
  }

  handleClick(event) {
    const sendBtn = this.adapter.getSendButton();
    if (!sendBtn) return;

    // Check if the click or any parent target is the send button
    if (event.target === sendBtn || sendBtn.contains(event.target)) {
      this.evaluateSubmission(event);
    }
  }

  handleSubmit(event) {
    const formEl = this.adapter.getFormElement();
    if (formEl && (event.target === formEl || formEl.contains(event.target))) {
      this.evaluateSubmission(event);
    }
  }

  evaluateSubmission(event) {
    // If user clicked 'Send Anyway' or 'Redact & Send', allow this submission to pass
    if (this.bypassNextSubmission) {
      this.bypassNextSubmission = false;
      return; // Allow native submission
    }

    // Check if guardian is enabled
    if (!this.settings.enabled || !this.settings.promptGuardianEnabled) {
      return; // Let host site process normally
    }

    const rawText = this.adapter.getInputValue();
    if (!rawText || !rawText.trim()) {
      return;
    }

    const piiResult = scanPromptForPII(rawText);

    if (piiResult.hasPII) {
      // STOP THE SUBMISSION BEFORE CHATGPT CAN PROCESS IT
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      // Log telemetry event (categorically only, zero raw text)
      logTelemetryEvent('prompt_warning_shown', {
        categoriesCount: piiResult.categories.length
      });

      // Present the accessible pre-submit decision modal
      this.uiManager.showPromptWarning({
        categories: piiResult.categories,
        redactedText: piiResult.redactedText,

        onRedact: (newText) => {
          logTelemetryEvent('prompt_redaction_applied');
          this.adapter.setInputValue(newText);
          // Set bypass and trigger immediate submission with redacted text
          this.bypassNextSubmission = true;
          setTimeout(() => {
            this.adapter.triggerSubmit();
          }, 30);
        },

        onSubmitOriginal: () => {
          logTelemetryEvent('prompt_submitted_original');
          this.bypassNextSubmission = true;
          setTimeout(() => {
            this.adapter.triggerSubmit();
          }, 30);
        },

        onReview: () => {
          logTelemetryEvent('prompt_submission_cancelled');
          const input = this.adapter.getInputElement();
          if (input) input.focus();
        },

        onCancel: () => {
          logTelemetryEvent('prompt_submission_cancelled');
        }
      });
    }
  }
}
