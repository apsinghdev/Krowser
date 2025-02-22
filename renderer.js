const webview = document.getElementById('webview');
const urlBar = document.getElementById('urlBar');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const reloadBtn = document.getElementById('reloadBtn');

// URL bar functionality
urlBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        let url = urlBar.value;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        webview.loadURL(url);
    }
});

// Basic navigation buttons
backBtn.addEventListener('click', () => {
    if (webview.canGoBack()) {
        webview.goBack();
    }
});

forwardBtn.addEventListener('click', () => {
    if (webview.canGoForward()) {
        webview.goForward();
    }
});

reloadBtn.addEventListener('click', () => {
    webview.reload();
});

// Update URL bar when navigation occurs
webview.addEventListener('did-navigate', (e) => {
    urlBar.value = e.url;
});

// Custom key bindings
document.addEventListener('keydown', (e) => {
    // Only trigger if not typing in URL bar
    if (document.activeElement !== urlBar) {
        switch(e.key.toLowerCase()) {
            // Scrolling
            case 'j':
                webview.executeJavaScript('window.scrollBy(0, 100)');
                break;
            case 'k':
                webview.executeJavaScript('window.scrollBy(0, -100)');
                break;
            case 'g':
                if (e.shiftKey) {
                    // Shift + G: scroll to bottom
                    webview.executeJavaScript('window.scrollTo(0, document.body.scrollHeight)');
                } else {
                    // g: scroll to top
                    webview.executeJavaScript('window.scrollTo(0, 0)');
                }
                break;
            case 'd':
                // Half page down
                webview.executeJavaScript(`
                    window.scrollBy(0, window.innerHeight * 0.5);
                `);
                break;
            case 'u':
                // Half page up
                webview.executeJavaScript(`
                    window.scrollBy(0, -window.innerHeight * 0.5);
                `);
                break;

            // Navigation
            case 'h':
                if (webview.canGoBack()) webview.goBack();
                break;
            case 'l':
                if (webview.canGoForward()) webview.goForward();
                break;
            case 'r':
                webview.reload();
                break;
            
            // Tab focus
            case '/':
                urlBar.focus();
                e.preventDefault();
                break;
            case 'escape':
                webview.focus();
                break;

            // Zoom
            case '=':
                if (e.ctrlKey) {
                    webview.setZoomLevel(webview.getZoomLevel() + 1);
                }
                break;
            case '-':
                if (e.ctrlKey) {
                    webview.setZoomLevel(webview.getZoomLevel() - 1);
                }
                break;
            case '0':
                if (e.ctrlKey) {
                    webview.setZoomLevel(0);
                }
                break;
        }
    }
});

// Add key bindings help
const showHelp = () => {
    const helpHTML = `
        <div style="padding: 20px">
            <h2>Keyboard Shortcuts</h2>
            <ul>
                <li>j - Scroll down</li>
                <li>k - Scroll up</li>
                <li>g - Scroll to top</li>
                <li>G - Scroll to bottom</li>
                <li>d - Half page down</li>
                <li>u - Half page up</li>
                <li>h - Go back</li>
                <li>l - Go forward</li>
                <li>r - Reload page</li>
                <li>/ - Focus URL bar</li>
                <li>Esc - Focus page</li>
                <li>Ctrl + = - Zoom in</li>
                <li>Ctrl + - - Zoom out</li>
                <li>Ctrl + 0 - Reset zoom</li>
            </ul>
        </div>
    `;
    webview.executeJavaScript(`
        const helpDiv = document.createElement('div');
        helpDiv.style.position = 'fixed';
        helpDiv.style.top = '50%';
        helpDiv.style.left = '50%';
        helpDiv.style.transform = 'translate(-50%, -50%)';
        helpDiv.style.background = 'white';
        helpDiv.style.border = '1px solid black';
        helpDiv.style.zIndex = '9999';
        helpDiv.innerHTML = \`${helpHTML}\`;
        document.body.appendChild(helpDiv);
        setTimeout(() => helpDiv.remove(), 3000);
    `);
};

// Add help shortcut
document.addEventListener('keydown', (e) => {
    if (e.key === '?' && document.activeElement !== urlBar) {
        showHelp();
    }
});