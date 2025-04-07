// Run when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: false });
    chrome.action.setBadgeText({ text: "OFF" });
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
        text: enabled ? "ON" : "OFF"
    });

    // Inject script into active tab if enabled
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && enabled) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: toggleFeature,
            args: [enabled]
        });
    }
}

// Listen for action click to toggle feature
chrome.action.onClicked.addListener(async (tab) => {
    let { enabled } = await chrome.storage.local.get("enabled");
    enabled = !enabled; // Toggle state
    console.log(`onClicked Feature is now ${enabled ? "enabled" : "disabled"}`);

    await chrome.storage.local.set({ enabled });

    chrome.action.setBadgeText({
        text: enabled ? "ON" : "OFF"
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleFeature,
        args: [enabled]
    });
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
        text: enabled ? "ON" : "OFF"
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleFeature,
        args: [enabled]
    });
});

// Function injected into the webpage
function toggleFeature(enabled) {
    console.log(`Feature is now ${enabled ? "enabled" : "disabled"}`);
    if (enabled) {
        const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        let levels = [0, 0, 0, 0, 0, 0];

        headings.forEach(heading => {
            let level = parseInt(heading.tagName.charAt(1)) - 1; // Determine heading level
            levels[level]++; // Increment level count
            for (let i = level + 1; i < levels.length; i++) {
                levels[i] = 0; // Reset lower levels
            }
            let number = levels.slice(0, level + 1).filter(n => n > 0).join("."); // Create numbering
            heading.dataset.originalText = heading.dataset.originalText || heading.textContent; // Store original text
            heading.textContent = `${number}. ${heading.dataset.originalText}`; // Prepend numbering
        });
    } else {
        document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(heading => {
            if (heading.dataset.originalText) {
                heading.textContent = heading.dataset.originalText;
            }
        });
    }
}
