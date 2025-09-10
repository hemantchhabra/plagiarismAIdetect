// Content script for handling text selection
let selectedText = "";

// Track text selection
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection.toString().trim().length > 0) {
    selectedText = selection.toString().trim();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCurrentSelection") {
    const selection = window.getSelection();
    const currentText = selection.toString().trim();
    sendResponse({ text: currentText || selectedText });
  }
});

// Clear selection tracking on page navigation
window.addEventListener('beforeunload', () => {
  selectedText = "";
});