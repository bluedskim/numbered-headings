// background.js - Handles extension icon clicks and updates state
chrome.action.onClicked.addListener((tab) => {
    chrome.storage.sync.get(["enabled"], (data) => {
      let newState = !data.enabled;
      chrome.storage.sync.set({ "enabled": newState }, () => {
        // Inject content script to update headings
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });
        // Update the extension icon
        updateIcon(newState);
      });
    });
  });
  
  // Function to update the extension icon based on state
  function updateIcon(enabled) {
    const iconPath = enabled ? "icon-on.png" : "icon-off.png";
    chrome.action.setIcon({ path: {
      "16": iconPath,
      "48": iconPath,
      "128": iconPath
    }});
  }
  
  // Set the correct icon when the extension is installed or updated
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["enabled"], (data) => {
      updateIcon(data.enabled || false);
    });
  });
  