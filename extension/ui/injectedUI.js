// UI Manager uniting Injected RakshAI components

import { createIdentityBadge } from './identityBadge.js';
import { openHelpPanel } from './helpPanel.js';
import { showPromptWarningModal } from './promptWarningModal.js';
import { attachResponseBanner } from './responseBanner.js';

export class UIManager {
  constructor(lang = 'en') {
    this.lang = lang;
  }

  setLanguage(newLang) {
    this.lang = newLang;
  }

  mountIdentityBadge() {
    createIdentityBadge(this.lang, () => {
      this.showHelp();
    });
  }

  showHelp() {
    openHelpPanel(this.lang);
  }

  showPromptWarning(options) {
    showPromptWarningModal({
      ...options,
      lang: this.lang
    });
  }

  attachResponseWarning(element, riskDetails) {
    return attachResponseBanner(element, this.lang, riskDetails, () => {
      this.showHelp();
    });
  }
}
