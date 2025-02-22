const KeyboardNavigator = {
  // State management
  state: {
    activeIndex: -1,
    searchResults: [],
    isSearchMode: false,
    quickFindActive: false,
    verticalLinks: [],
    inputFields: [], // Added for input fields navigation
  },

  // Key bindings configuration
  keyBindings: {
    // Core commands as per README
    "Alt+L": "navigateResultLinks",
    "Control+F": "navigateSearchResults", 
    "Control+L+F": "searchClickableByName",
    "Alt+L+F": "findAllClickables",
    "Alt+F": "findHttpLinks",
    "Alt+H": "showShortcutsSearch",
    "Alt+I": "navigateInputFields",
    "Alt+N": "goForward",
    "Alt+P": "goBackward",

    // Additional useful commands
    "Alt+S": "highlightSearchResults", // Navigate search results
    "Alt+V": "highlightVerticalLinks", // NEW: Highlight vertical links after search
    "Alt+B": "navigateBackInHistory", // Go back in history
    "Alt+T": "switchTabs", // Switch between tabs
    "Alt+M": "highlightMedia", // Navigate through media elements
    "Alt+C": "copyCurrentUrl", // Copy current URL
    "Alt+D": "focusAddressBar", // Focus address bar
    "Alt+R": "reloadPage", // Reload page
    "Alt+O": "scrollToBottom", // Scroll to bottom
  },

  // Add new methods
  navigateResultLinks() {
    const links = document.querySelectorAll('a');
    this.state.searchResults = Array.from(links);
    this.state.isSearchMode = true;
    this.highlightCurrentElement();
  },

  navigateInputFields() {
    const inputs = document.querySelectorAll('input, textarea, select');
    this.state.inputFields = Array.from(inputs);
    this.state.activeIndex = 0;
    this.highlightCurrentElement();
  },

  goForward() {
    // Send message to renderer process
    window.postMessage({ type: 'navigation', action: 'forward' }, '*');
  },

  // Add more methods for other commands...

  handleKeyPress(e) {
    // Add handling for Alt+N
    if (e.altKey && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      this.goForward();
      return;
    }

    // Handle up/down navigation
    if (this.state.isSearchMode) {
      if (e.key === 'ArrowDown') {
        this.state.activeIndex = Math.min(this.state.activeIndex + 1, this.state.searchResults.length - 1);
        this.highlightCurrentElement();
      } else if (e.key === 'ArrowUp') {
        this.state.activeIndex = Math.max(this.state.activeIndex - 1, 0);
        this.highlightCurrentElement();
      } else if (e.key === 'Enter') {
        this.clickCurrentElement();
      }
    }
  },

  // Helper methods
  highlightCurrentElement() {
    // Remove previous highlights
    document.querySelectorAll('.krowser-highlight').forEach(el => {
      el.classList.remove('krowser-highlight');
    });

    // Add highlight to current element
    const currentElement = this.state.searchResults[this.state.activeIndex];
    if (currentElement) {
      currentElement.classList.add('krowser-highlight');
      currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  init() {
    document.addEventListener("keydown", this.handleKeyPress.bind(this));
    this.createHighlightStyle();
  },
};

// Initialize
KeyboardNavigator.init();
