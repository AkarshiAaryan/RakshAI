// RakshAI Response Guardian — DOM Observation & Safety Cue Engine

import { scanResponseForRisks } from './safetyRules.js';
import { logTelemetryEvent } from '../utils/telemetry.js';

export class ResponseGuardian {
  constructor(adapter, uiManager, settings) {
    this.adapter = adapter;
    this.uiManager = uiManager;
    this.settings = settings;
    this.observer = null;
    this.processedElements = new WeakSet();
    this.debounceTimers = new WeakMap();
    this.isObserving = false;
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  start() {
    if (this.isObserving) return;

    const container = this.adapter.getResponseContainer();
    if (!container) {
      // Retry in 1s if DOM container isn't ready yet
      setTimeout(() => this.start(), 1000);
      return;
    }

    this.observer = new MutationObserver(this.handleMutations.bind(this));
    this.observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true
    });

    this.isObserving = true;
    // Initial scan of any existing messages
    this.scanExistingMessages();
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isObserving = false;
  }

  handleMutations(mutations) {
    if (!this.settings.enabled || !this.settings.responseGuardianEnabled) {
      return;
    }

    const selector = this.adapter.getAssistantMessageSelector();
    for (const mutation of mutations) {
      // Check added nodes
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches && node.matches(selector)) {
              this.scheduleScan(node);
            } else if (node.querySelectorAll) {
              const matches = node.querySelectorAll(selector);
              matches.forEach(el => this.scheduleScan(el));
            }
          }
        });
      } else if (mutation.type === 'characterData') {
        // Text node updated during streaming
        const parent = mutation.target.parentElement;
        if (parent) {
          const assistantEl = parent.closest(selector);
          if (assistantEl) {
            this.scheduleScan(assistantEl);
          }
        }
      }
    }
  }

  scheduleScan(element) {
    if (!element || this.processedElements.has(element)) {
      return;
    }

    // Debounce streaming responses to scan after token stream pauses
    if (this.debounceTimers.has(element)) {
      clearTimeout(this.debounceTimers.get(element));
    }

    const timer = setTimeout(() => {
      this.evaluateResponse(element);
    }, 400);

    this.debounceTimers.set(element, timer);
  }

  scanExistingMessages() {
    const selector = this.adapter.getAssistantMessageSelector();
    const existing = document.querySelectorAll(selector);
    existing.forEach(el => this.evaluateResponse(el));
  }

  evaluateResponse(element) {
    if (!element || !element.isConnected) return;

    // Check if the element is currently flagged or already scanned
    if (element.hasAttribute('data-rakshai-evaluated')) {
      return;
    }

    // If still actively streaming and not finished, wait for next pause
    if (this.adapter.isStreaming(element)) {
      this.scheduleScan(element);
      return;
    }

    element.setAttribute('data-rakshai-evaluated', 'true');
    const responseText = element.innerText || element.textContent || '';
    if (!responseText.trim()) return;

    const riskResult = scanResponseForRisks(responseText);

    if (riskResult.hasRisk) {
      this.processedElements.add(element);

      // Log telemetry event (categorically only)
      logTelemetryEvent('response_warning_shown', {
        riskCategories: riskResult.matchedRules.map(r => r.category).join(',')
      });

      // Attach non-intrusive verification badge
      this.uiManager.attachResponseWarning(element, riskResult.matchedRules);
    }
  }
}
