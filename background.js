chrome.action.onClicked.addListener(async (tab) => {
    let { enabled } = await chrome.storage.local.get("enabled");
    enabled = !enabled; // Toggle state

    // Save the new state
    await chrome.storage.local.set({ enabled });

    // Update the badge text
    chrome.action.setBadgeText({
        text: enabled ? "ON" : "OFF"
    });

    console.log(`Feature is now ${enabled ? "enabled" : "disabled"}`);

    // Execute function in the active tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleFeature, // Calls function directly
        args: [enabled] // Pass toggle state
    });
});

// Function injected into the webpage
function toggleFeature(enabled) {
    if (enabled) {
	  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
	  let levels = [0, 0, 0, 0, 0, 0];
	  
	  headings.forEach(heading => {
		let level = parseInt(heading.tagName.charAt(1)) - 1; // Determine heading level (h1=0, h2=1, etc.)
		levels[level]++; // Increment the count for the current level
		for (let i = level + 1; i < levels.length; i++) {
		  levels[i] = 0; // Reset lower levels when moving to a new section
		}
		let number = levels.slice(0, level + 1).filter(n => n > 0).join("."); // Create hierarchical numbering
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

function addNumbering() {
  console.log('addNumbering')
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  let levels = [0, 0, 0, 0, 0, 0];
  
  headings.forEach(heading => {
	let level = parseInt(heading.tagName.charAt(1)) - 1; // Determine heading level (h1=0, h2=1, etc.)
	levels[level]++; // Increment the count for the current level
	for (let i = level + 1; i < levels.length; i++) {
	  levels[i] = 0; // Reset lower levels when moving to a new section
	}
	let number = levels.slice(0, level + 1).filter(n => n > 0).join("."); // Create hierarchical numbering
	heading.dataset.originalText = heading.dataset.originalText || heading.textContent; // Store original text
	heading.textContent = `${number}. ${heading.dataset.originalText}`; // Prepend numbering
  });
}    

function removeNumbering() {
  console.log('removeNumbering')
  document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(heading => {
	if (heading.dataset.originalText) {
	  heading.textContent = heading.dataset.originalText;
	}
  });
}  

// Initialize badge text when the extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: false });
    chrome.action.setBadgeText({ text: "OFF" });
});
