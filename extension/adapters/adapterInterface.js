// Base Site Adapter Interface for RakshAI Chatbot Adapters

export class BaseSiteAdapter {
  constructor(name) {
    this.name = name;
  }

  matches(url) {
    throw new Error('Adapter must implement matches(url)');
  }

  getInputElement() {
    throw new Error('Adapter must implement getInputElement()');
  }

  getInputValue() {
    throw new Error('Adapter must implement getInputValue()');
  }

  setInputValue(value) {
    throw new Error('Adapter must implement setInputValue(value)');
  }

  getSendButton() {
    throw new Error('Adapter must implement getSendButton()');
  }

  getFormElement() {
    return null;
  }

  triggerSubmit() {
    throw new Error('Adapter must implement triggerSubmit()');
  }

  getResponseContainer() {
    throw new Error('Adapter must implement getResponseContainer()');
  }

  getAssistantMessageSelector() {
    throw new Error('Adapter must implement getAssistantMessageSelector()');
  }

  isStreaming(element) {
    return false;
  }
}
