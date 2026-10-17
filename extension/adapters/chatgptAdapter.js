// ChatGPT Web Interface Adapter for RakshAI
// Supports https://chatgpt.com/* and https://chat.openai.com/*

import { BaseSiteAdapter } from './adapterInterface.js';

export class ChatGPTAdapter extends BaseSiteAdapter {
  constructor() {
    super('ChatGPT');
  }

  matches(url) {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return (
        parsed.hostname === 'chatgpt.com' ||
        parsed.hostname.endsWith('.chatgpt.com') ||
        parsed.hostname === 'chat.openai.com'
      );
    } catch (e) {
      return false;
    }
  }

  getInputElement() {
    // Primary: ProseMirror contenteditable prompt box
    const contentEditable = document.querySelector('div#prompt-textarea[contenteditable="true"]') ||
                            document.querySelector('div[contenteditable="true"]#prompt-textarea') ||
                            document.querySelector('div[contenteditable="true"][data-placeholder]');
    if (contentEditable) return contentEditable;

    // Fallback: standard textarea if present
    const textarea = document.querySelector('textarea#prompt-textarea') ||
                     document.querySelector('textarea[data-id="root"]');
    return textarea || null;
  }

  getInputValue() {
    const input = this.getInputElement();
    if (!input) return '';

    if (input.tagName.toLowerCase() === 'textarea') {
      return input.value || '';
    }

    // For contenteditable, retrieve clean text
    const text = input.innerText || input.textContent || '';
    // Normalize trailing newline that browsers insert in contenteditable
    return text.replace(/\n$/, '');
  }

  setInputValue(newValue) {
    const input = this.getInputElement();
    if (!input) return;

    if (input.tagName.toLowerCase() === 'textarea') {
      input.value = newValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    // For ProseMirror / contenteditable:
    input.focus();
    // Wrap lines in <p> tags for ProseMirror compatibility
    const paragraphs = newValue.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('');
    input.innerHTML = paragraphs || '<p><br></p>';

    // Dispatch input and change events so React/framework state updates
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: newValue }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  getSendButton() {
    return (
      document.querySelector('button[data-testid="send-button"]') ||
      document.querySelector('button[aria-label="Send prompt"]') ||
      document.querySelector('button[data-testid="fruitjuice-send-button"]') ||
      document.querySelector('form button[type="submit"]') ||
      null
    );
  }

  getFormElement() {
    const input = this.getInputElement();
    return input ? input.closest('form') : null;
  }

  triggerSubmit() {
    const sendBtn = this.getSendButton();
    if (sendBtn && !sendBtn.disabled) {
      sendBtn.click();
      return true;
    }

    // Fallback: dispatch synthetic Enter keydown on input
    const input = this.getInputElement();
    if (input) {
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      });
      input.dispatchEvent(enterEvent);
      return true;
    }

    return false;
  }

  getResponseContainer() {
    return (
      document.querySelector('main') ||
      document.querySelector('div[role="presentation"]') ||
      document.body
    );
  }

  getAssistantMessageSelector() {
    return 'div[data-message-author-role="assistant"], article[data-testid^="conversation-turn-"]';
  }

  isStreaming(element) {
    // Check for streaming indicator or active stop button
    if (!element) return false;
    const hasCursor = element.querySelector('.result-streaming, [class*="streaming"]');
    const stopButton = document.querySelector('button[data-testid="stop-button"], button[aria-label="Stop streaming"]');
    return Boolean(hasCursor || stopButton);
  }
}
