document.addEventListener('DOMContentLoaded', function() {
    const user = 'Dexin09'; // GitHub username
    const repo = '10Media-Arts'; // Repository name
    const baseUrl = `https://${user}.github.io/${repo}/`;

    // Set the title dynamically based on the URL path
    function setTitle() {
        const path = window.location.pathname.replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes
        const title = path ? path.replace(/\//g, ' / ') : repo; // Format the title
        document.title = title;
        const titleElement = document.querySelector('.title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    // Check localStorage for cached data
    const cacheKey = 'dexin09githubio10mediaartstoccache';
    const cacheTimestampKey = 'tocCacheTimestamp';
    const cacheDuration = 3600 * 1000; // 1 hour in milliseconds

    async function fetchRepoContents(path = '') {
        const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    async function generateTOC(path = '') {
        const contents = await fetchRepoContents(path);
        let html = '<ul>';
        for (const item of contents) {
            if (item.type === 'dir') {
                html += `<li><a href="${baseUrl}${item.path}">${item.name}/</a>`;
                html += await generateTOC(item.path); // Recursively fetch subfolders
                html += '</li>';
            } else if (item.type === 'file' && item.name !== 'index.html') {
                html += `<li><a href="${baseUrl}${item.path}">${item.name}</a></li>`;
            }
        }
        html += '</ul>';
        return html;
    }

    async function initTOC() {
        try {
            let tocHtml;
            const now = new Date().getTime();
            const cacheTimestamp = localStorage.getItem(cacheTimestampKey);

            // Use cached data if it's available and not expired
            if (localStorage.getItem(cacheKey) && cacheTimestamp && (now - cacheTimestamp < cacheDuration)) {
                tocHtml = localStorage.getItem(cacheKey);
            } else {
                tocHtml = await generateTOC();
                localStorage.setItem(cacheKey, tocHtml);
                localStorage.setItem(cacheTimestampKey, now);
            }

            document.getElementById('toc').innerHTML = tocHtml;
        } catch (error) {
            console.error('Error generating TOC:', error);
            document.getElementById('toc').innerHTML = 'Failed to load Table of Contents.';
        }
    }

    setTitle();
    initTOC();
});
