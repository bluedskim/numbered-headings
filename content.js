(function() {
    function addNumbering() {
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      let levels = [0, 0, 0, 0, 0, 0];
      
      headings.forEach(heading => {
        let level = parseInt(heading.tagName.charAt(1)) - 1;
        levels[level]++;
        for (let i = level + 1; i < levels.length; i++) {
          levels[i] = 0;
        }
        let number = levels.slice(0, level + 1).filter(n => n > 0).join(".");
        heading.textContent = `${number}. ${heading.textContent}`;
      });
    }
    
    addNumbering();
  })();