(function() {
    // Function to add hierarchical numbering to headings
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
    
    // Function to remove numbering and restore original text
    function removeNumbering() {
      console.log('removeNumbering')
      document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(heading => {
        if (heading.dataset.originalText) {
          heading.textContent = heading.dataset.originalText;
        }
      });
    }
    
    // Check stored state and apply the appropriate function
    chrome.storage.sync.get(["enabled"], (data) => {
      if (data.enabled) {
        addNumbering();
      } else {
        removeNumbering();
      }
    });
  })();