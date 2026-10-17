// RakshAI Extension Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    const defaultSettings = {
      enabled: true,
      language: 'en', // 'en', 'hi', 'hinglish'
      promptGuardianEnabled: true,
      responseGuardianEnabled: true,
      researchLoggingEnabled: false, // OFF by default as per privacy spec
      activeProfile: 'teen_priya'
    };

    try {
      await chrome.storage.local.set(defaultSettings);
      console.log('[RakshAI] Extension installed with default local settings.');
    } catch (err) {
      console.error('[RakshAI] Error setting default configuration:', err);
    }
  }
});

// Listener for runtime messages if needed
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ status: 'PONG', version: '1.0.0' });
  }
  return true;
});
