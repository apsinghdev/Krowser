const KeyboardNavigator = {
  // State management
  state: {
    activeIndex: -1,
    searchResults: [],
    isSearchMode: false,
    quickFindActive: false,
    verticalLinks: [],
  },

  // Key bindings configuration
  keyBindings: {
    // Original requested features
    "Alt+L": "highlightLinks", // Navigate through links
    "Alt+S": "highlightSearchResults", // Navigate search results
    "Alt+F": "quickFind", // Quick find and click by name
    "Alt+V": "highlightVerticalLinks", // NEW: Highlight vertical links after search

    // Additional useful commands
    "Alt+H": "highlightHeadings", // Navigate through headings
    "Alt+B": "navigateBackInHistory", // Go back in history
    "Alt+N": "navigateForwardInHistory", // Go forward in history
    "Alt+T": "switchTabs", // Switch between tabs
    "Alt+I": "highlightInputs", // Navigate through input fields
    "Alt+M": "highlightMedia", // Navigate through media elements
    "Alt+C": "copyCurrentUrl", // Copy current URL
    "Alt+D": "focusAddressBar", // Focus address bar
    "Alt+R": "reloadPage", // Reload page
    "Alt+P": "scrollToTop", // Scroll to top
    "Alt+O": "scrollToBottom", // Scroll to bottom
  },
  init() {
    document.addEventListener("keydown", this.handleKeyPress.bind(this));
    this.createHighlightStyle();
  },
};
