# Plagiarism & AI Content Checker - Chrome Extension

A powerful Chrome extension that helps detect AI-generated content and potential plagiarism in selected text across any website.

## Features

- **Right-click Analysis**: Select text on any webpage, right-click, and choose "Plagiarism & AI Content Checker"
- **Instant Detection**: Quickly analyze text for AI generation patterns and plagiarism
- **Detailed Results**: Get percentage scores and highlighted segments showing different content types
- **Clean Interface**: Professional popup design with easy-to-understand results
- **Cross-site Compatibility**: Works on all websites and web pages

## Installation

### From Chrome Web Store (Recommended)
1. Visit the Chrome Web Store
2. Search for "Plagiarism & AI Content Checker"
3. Click "Add to Chrome"
4. Confirm installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the `extension` folder
5. The extension will be installed and ready to use

## How to Use

### Method 1: Context Menu (Recommended)
1. Select any text on a webpage
2. Right-click to open the context menu
3. Click "Plagiarism & AI Content Checker"
4. The extension popup will open with your selected text ready for analysis
5. Click "Analyze Text" or wait for automatic analysis

### Method 2: Manual Input
1. Click the extension icon in the Chrome toolbar
2. Paste or type your text in the input area
3. Click "Analyze Text" to start the analysis
4. Review the detailed results

## Results Explanation

The extension provides three main scores:

- **Original Content** (Green): Percentage of text that appears to be originally written
- **AI Generated** (Orange): Percentage of text that shows patterns of AI generation
- **Potentially Plagiarized** (Red): Percentage of text that may be copied from other sources

## Privacy & Security

- **No Data Collection**: Your text is analyzed locally and never sent to external servers
- **Secure Processing**: All analysis happens within your browser
- **No Account Required**: Use the extension without signing up or providing personal information

## Technical Details

- **Manifest Version**: 3 (Latest Chrome Extension standard)
- **Permissions**: 
  - `contextMenus`: For right-click menu integration
  - `activeTab`: For accessing selected text on current page
  - `storage`: For temporary text storage between context menu and popup
- **Offline Capable**: Works without internet connection

## Development

### Building for Chrome Web Store

1. Ensure all files are in the `extension/` folder
2. Zip the contents of the `extension/` folder (not the folder itself)
3. The zip file should contain: `manifest.json`, `background.js`, `content.js`, `popup.html`, `popup.js`, and `icons/` folder
4. Upload the zip file to the Chrome Web Store Developer Dashboard

### File Structure
```
extension/
├── manifest.json       # Extension configuration
├── background.js       # Service worker for context menu
├── content.js         # Content script for text selection
├── popup.html         # Extension popup interface
├── popup.js           # Popup functionality
├── icons/             # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # This file
```

## Version History

- **v1.0.0**: Initial release with context menu integration and text analysis

## Support

For issues or feature requests, please visit the Chrome Web Store listing or contact support.

## License

This extension is provided as-is for text analysis purposes. Please ensure you have the right to analyze any text you process.