document.addEventListener("DOMContentLoaded", () => {
    // 1. Landing Page Dropdown Logic
    const dropdownBtn = document.getElementById("browser-dropdown-btn");
    const dropdownMenu = document.getElementById("browser-dropdown-menu");

    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });
        document.addEventListener("click", () => {
            dropdownMenu.classList.remove("show");
        });
    }

    // 2. Documentation Loader Logic
    const docContainer = document.getElementById("markdown-content");
    if (docContainer) {
        loadDocumentation();
        highlightActiveSidebarLink();
    }
});

function highlightActiveSidebarLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'overview';
    const links = document.querySelectorAll('.sidebar nav a');
    
    links.forEach(link => {
        if (link.getAttribute('href') === `?page=${page}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

async function loadDocumentation() {
    const docContainer = document.getElementById("markdown-content");
    const docTitle = document.getElementById("doc-title");
    
    const urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get('page') || 'overview'; // Changed default to overview

    let filePath = `/docs/${page}.md`;
    if (page === 'drive-privacy') {
        filePath = `/oauth/drive-privacy.md`;
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("Document not found");
        
        let markdownText = await response.text();

        // -- FIXED PRE-PROCESSOR --
        
        let title = "Documentation";
        
        // Highly resilient Regex for Frontmatter (handles \r\n and \n)
        const frontmatterRegex = /^\s*---\r?\n([\s\S]*?)\r?\n---/;
        const match = markdownText.match(frontmatterRegex);
        
        if (match) {
            const frontmatter = match[1];
            
            // Extract Title robustly (ignoring trailing whitespace/carriage returns)
            const titleMatch = frontmatter.match(/title:\s*([^\r\n]+)/i);
            if (titleMatch) {
                title = titleMatch[1].trim();
            }
            
            // Remove frontmatter block from the actual markdown text
            markdownText = markdownText.replace(frontmatterRegex, '').trim();
        }
        
        // Update browser tab and page header correctly
        document.title = `${title} - Shield Authenticator`;
        if (docTitle) docTitle.textContent = title;

        // Parse Jekyll Warnings
        const alertRegex = /\{%\s*include\s*warning\.html\s*class="([^"]+)"\s*message="([^"]+)"\s*%\}/g;
        markdownText = markdownText.replace(alertRegex, (match, className, message) => {
            return `<div class="alert ${className}">${message}</div>`;
        });

        // Clean up table attributes
        markdownText = markdownText.replace(/\{:\s*\.table[^}]*\}/g, '');

        // Render with marked.js
        if (typeof marked !== 'undefined') {
            docContainer.innerHTML = marked.parse(markdownText);
        } else {
            docContainer.innerHTML = "<p>Error: marked.js library not loaded.</p>";
        }

    } catch (error) {
        if (docTitle) docTitle.textContent = "Page Not Found";
        docContainer.innerHTML = `
            <div class="alert danger">
                <h4>Error 404</h4>
                <p>We couldn't load the documentation for "${page}". It may have been moved or renamed.</p>
                <a href="?page=overview" style="color: inherit; margin-top: 10px; display: inline-block;">Return to Overview</a>
            </div>`;
    }
}