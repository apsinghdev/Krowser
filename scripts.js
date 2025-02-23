class Krowser {
  constructor() {
    this.state = {
      activeIndex: -1,
      searchResults: [],
      isSearchMode: false,
      quickFindActive: false,
      verticalLinks: [],
    };
    this.keyBindings = {
      // Original requested features
      "Alt+L": "highlightLinks", // Navigate through links
      "Alt+S": "highlightSearchResults", // Navigate search results
      "Alt+F": "quickFind", // Quick find and click by name
      "Alt+V": "highlightVerticalLinks", // Highlight vertical links after search

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
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.init = this.init.bind(this);
  }

  getKeyCombo(event) {
    const modifiers = [];
    if (event.altKey) modifiers.push("Alt");
    if (event.ctrlKey) modifiers.push("Ctrl");
    if (event.shiftKey) modifiers.push("Shift");
    const key = event.key.toUpperCase();
    const combo = [...modifiers, key].join("+");
    console.log(combo);
    return key;
  }

  handleKeyPress = (event) => {
    event.preventDefault();
    console.log("handleKeyPress", event);

    if (event.metaKey && event.key.toUpperCase() === "L") {
      event.preventDefault();
      console.log("Alt + L detected!");
      this.clickFirstLink();
    }
  };

  clickFirstLink() {
    const webview = document.querySelector("#webview");

    if (webview) {
      console.log("Found webview:", webview.src);
      // Option 1: Navigate directly to the src URL
      if (webview.src) {
        console.log(webview.src)
        window.location.href = webview.src;
      }
    }
  }

  init() {
    console.log("init called");
    document.addEventListener("keydown", (event) => {
      this.handleKeyPress(event);
    });
    this.createHighlightStyle();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const navigator = new Krowser();
  navigator.init();
});
