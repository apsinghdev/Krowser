// Browser elements
const webview = document.getElementById('webview');
const urlBar = document.getElementById('urlBar');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const reloadBtn = document.getElementById('reloadBtn');
const homeBtn = document.getElementById('homeBtn');

// Constants
const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q=';
const HOME_URL = 'https://www.google.com';

// Browser state
let currentZoomLevel = 1;
let isFullscreen = false;

// URL handling
class URLHandler {
    static isValidURL(input) {
        const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
        return urlPattern.test(input) || input.includes('localhost');
    }

    static formatURL(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return 'https://' + url;
        }
        return url;
    }

    static handleNavigation(input) {
        if (!input.trim()) {
            webview.loadURL(HOME_URL);
            return;
        }

        if (this.isValidURL(input)) {
            webview.loadURL(this.formatURL(input));
        } else {
            webview.loadURL(GOOGLE_SEARCH_URL + encodeURIComponent(input));
        }
    }
}

// Event Handlers
class BrowserEvents {
    static init() {
        this.setupURLBar();
        this.setupNavigationButtons();
        this.setupWebviewEvents();
        this.setupKeyboardShortcuts();
    }

    static setupURLBar() {
        urlBar.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                URLHandler.handleNavigation(urlBar.value);
            }
        });
    }

    static setupNavigationButtons() {
        backBtn.addEventListener('click', () => {
            if (webview.canGoBack()) webview.goBack();
        });

        forwardBtn.addEventListener('click', () => {
            if (webview.canGoForward()) webview.goForward();
        });

        reloadBtn.addEventListener('click', () => webview.reload());
        
        homeBtn.addEventListener('click', () => webview.loadURL(HOME_URL));
    }

    static setupWebviewEvents() {
        webview.addEventListener('did-navigate', (e) => {
            urlBar.value = e.url;
            this.updateNavigationButtons();
        });

        webview.addEventListener('did-finish-load', () => {
            this.updateNavigationButtons();
        });
    }

    static updateNavigationButtons() {
        backBtn.disabled = !webview.canGoBack();
        forwardBtn.disabled = !webview.canGoForward();
    }

    static setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (document.activeElement === urlBar) return;

            const shortcuts = {
                // Navigation
                'Alt+Left': () => webview.canGoBack() && webview.goBack(),
                'Alt+Right': () => webview.canGoForward() && webview.goForward(),
                'Alt+N': () => webview.canGoForward() && webview.goForward(),
                'Alt+P': () => webview.canGoBack() && webview.goBack(),
                'F5': () => webview.reload(),
                'Alt+Home': () => webview.loadURL(HOME_URL),

                // Zoom
                'Control+=': () => this.adjustZoom(0.1),
                'Control+-': () => this.adjustZoom(-0.1),
                'Control+0': () => this.resetZoom(),

                // Focus
                '/': () => {
                    urlBar.focus();
                    urlBar.select();
                    e.preventDefault();
                },
                'Escape': () => webview.focus(),

                // Fullscreen
                'F11': () => this.toggleFullscreen()
            };

            const shortcut = Object.keys(shortcuts).find(key => {
                const parts = key.toLowerCase().split('+');
                const lastKey = parts.pop();
                return parts.every(modifier => e[modifier.toLowerCase() + 'Key']) && 
                       e.key.toLowerCase() === lastKey.toLowerCase();
            });

            if (shortcut) {
                e.preventDefault();
                shortcuts[shortcut]();
            }
        });
    }

    static adjustZoom(delta) {
        currentZoomLevel = Math.max(0.2, Math.min(5, currentZoomLevel + delta));
        webview.setZoomLevel(Math.log2(currentZoomLevel));
    }

    static resetZoom() {
        currentZoomLevel = 1;
        webview.setZoomLevel(0);
    }

    static toggleFullscreen() {
        const window = require('electron').remote.getCurrentWindow();
        isFullscreen = !isFullscreen;
        window.setFullScreen(isFullscreen);
    }
}

// Initialize browser events
BrowserEvents.init();

// Handle messages from content script
window.addEventListener('message', (event) => {
    if (event.data.type === 'navigation') {
        switch (event.data.action) {
            case 'forward':
                if (webview.canGoForward()) webview.goForward();
                break;
            case 'backward':
                if (webview.canGoBack()) webview.goBack();
                break;
        }
    }
});