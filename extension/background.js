// Background script for Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item
  chrome.contextMenus.create({
    id: "plagiarismChecker",
    title: "Plagiarism & AI Content Checker",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "plagiarismChecker" && info.selectionText) {
    // Store selected text
    chrome.storage.local.set({ 
      selectedText: info.selectionText,
      analysisRequested: true 
    });
    
    // Open extension popup
    chrome.action.openPopup();
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    chrome.storage.local.get(["selectedText", "analysisRequested"], (result) => {
      sendResponse({
        text: result.selectedText || "",
        autoAnalyze: result.analysisRequested || false
      });
      
      // Clear the flag after sending
      if (result.analysisRequested) {
        chrome.storage.local.set({ analysisRequested: false });
      }
    });
    return true; // Keep message channel open
  }
});