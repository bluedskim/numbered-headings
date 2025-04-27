// Run when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: false });
    chrome.action.setBadgeText({ text: "" });
    console.log("Extension installed or updated.");
});

// Run when Chrome starts (Fix for service worker behavior in Manifest V3)
chrome.runtime.onStartup.addListener(() => {
    console.log("Chrome started, initializing extension...");
    initializeExtension();
});

// Function to initialize the extension state
async function initializeExtension() {
    let { enabled } = await chrome.storage.local.get("enabled");
    if (enabled === undefined) {
        enabled = false; // Default to false if not set
        await chrome.storage.local.set({ enabled });
    }
    console.log(`Extension initialized. Feature is ${enabled ? "enabled" : "disabled"}`);

    // Update the badge text
    chrome.action.setBadgeText({
        text: enabled ? "ON" : ""
    });

    // Inject script into active tab if enabled
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && enabled) {
        chrome.tabs.sendMessage(
            tab.id,
            {
                action: "toggleFeature",
                enabled: enabled
            }
        );
    }
}

// Listen for action click to toggle feature
chrome.action.onClicked.addListener(async (tab) => {
    let { enabled } = await chrome.storage.local.get("enabled");
    enabled = !enabled; // Toggle state
    console.log(`onClicked Feature is now ${enabled ? "enabled" : "disabled"}`);

    await chrome.storage.local.set({ enabled });

    chrome.action.setBadgeText({
        text: enabled ? "ON" : ""
    });

    chrome.tabs.sendMessage(
        tab.id,
        {
            action: "toggleFeature",
            enabled: enabled
        }
    );
});

/**
 * 화면 리로드
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    let { enabled } = await chrome.storage.local.get("enabled");
    console.log(`onUpdated enabled is ${enabled}`);

    if (enabled === undefined) {
        enabled = false; // Default to false if not set
        await chrome.storage.local.set({ enabled });
    }
    console.log(`onUpdated Feature is now ${enabled ? "enabled" : "disabled"}`);

    chrome.action.setBadgeText({
        text: enabled ? "ON" : ""
    });

    chrome.tabs.sendMessage(
        tab.id,
        {
            action: "toggleFeature",
            enabled: enabled
        }
    );
});