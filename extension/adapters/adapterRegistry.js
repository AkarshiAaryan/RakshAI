// Adapter Registry for RakshAI Site Adapters

import { ChatGPTAdapter } from './chatgptAdapter.js';

class AdapterRegistry {
  constructor() {
    this.adapters = [];
    this.register(new ChatGPTAdapter());
  }

  register(adapter) {
    this.adapters.push(adapter);
  }

  getAdapterForUrl(url) {
    const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    return this.adapters.find(adapter => adapter.matches(targetUrl)) || null;
  }
}

export const adapterRegistry = new AdapterRegistry();
