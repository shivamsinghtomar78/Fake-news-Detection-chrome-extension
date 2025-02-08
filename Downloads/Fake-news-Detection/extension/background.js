chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    checkedUrls: []
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'analysisResults') {
    chrome.storage.local.get('checkedUrls', (data) => {
      const checkedUrls = data.checkedUrls || [];
      checkedUrls.push({
        url: message.data.url,
        timestamp: new Date().toISOString(),
        results: message.data
      });
      chrome.storage.local.set({ checkedUrls });
    });
  }
});