// Function injected into the webpage
function toggleFeature(enabled) {
    console.log(`Feature is now... ${enabled ? "enabled" : "disabled"}`);
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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "toggleFeature") {
        toggleFeature(request.enabled);
    }
  });