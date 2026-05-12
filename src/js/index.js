document.addEventListener("DOMContentLoaded", () => {
    // 1. Landing Page Dropdown Logic
    const dropdownBtn = document.getElementById("browser-dropdown-btn");
    const dropdownMenu = document.getElementById("browser-dropdown-menu");

    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", () => {
            dropdownMenu.classList.remove("show");
        });
    }

    // 2. Documentation Loader Logic
    const docContainer = document.getElementById("markdown-content");
    if (docContainer) {
        loadDocumentation();
    }
});

async function loadDocumentation() {
    const docContainer = document.getElementById("markdown-content");
    const docTitle = document.getElementById("doc-title");
    
    // Get page from URL, default to 'overview' or 'index'
    const urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get('page') || 'overview';

    // Determine path (handle oauth drive-privacy redirect nicely)
    let filePath = `/docs/${page}.md`;
    if (page === 'drive-privacy') {
        filePath = `/oauth/drive-privacy.md`;
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("Document not found");
        
        let markdownText = await response.text();

        // -- PRE-PROCESSOR --
        
        // A. Extract YAML Frontmatter
        let title = "Documentation";
        const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
        const match = markdownText.match(frontmatterRegex);
        if (match) {
            const frontmatter = match[1];
            const titleMatch = frontmatter.match(/title:\s*(.*)/);
            if (titleMatch) title = titleMatch[1];
            
            // Remove frontmatter from the text to be rendered
            markdownText = markdownText.replace(frontmatterRegex, '');
        }
        
        // Update browser tab and page header
        document.title = `${title} - Shield Authenticator`;
        if (docTitle) docTitle.textContent = title;

        // B. Parse Jekyll Warnings ({% include warning.html ... %})
        const alertRegex = /\{%\s*include\s*warning\.html\s*class="([^"]+)"\s*message="([^"]+)"\s*%\}/g;
        markdownText = markdownText.replace(alertRegex, (match, className, message) => {
            // Strip any inner HTML tags from message if you want it pure, or let it render
            return `<div class="alert ${className}">${message}</div>`;
        });

        // C. Clean up Kramdown table attributes {: .table .table-striped}
        markdownText = markdownText.replace(/\{:\s*\.table[^}]*\}/g, '');

        // -- RENDER WITH MARKED.JS --
        if (typeof marked !== 'undefined') {
            docContainer.innerHTML = marked.parse(markdownText);
        } else {
            docContainer.innerHTML = "<p>Error: marked.js library not loaded.</p>";
        }

    } catch (error) {
        docContainer.innerHTML = `
            <div class="alert danger">
                <h3>Page Not Found</h3>
                <p>We couldn't load the documentation for "${page}".</p>
                <a href="/docs/index.html">Return to Docs Home</a>
            </div>`;
    }
}