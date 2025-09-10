# Plagiarism & AI Content Checker - Chrome Extension

A powerful Chrome extension that helps you detect AI-generated content and potential plagiarism in selected text from any webpage.

## Features

- 🔍 **Right-click Context Menu**: Select text on any webpage and analyze it directly
- 🤖 **AI Content Detection**: Identifies potentially AI-generated text segments
- 📋 **Plagiarism Detection**: Checks for potential plagiarized content
- 📊 **Detailed Analysis**: Shows confidence scores and highlights suspicious segments
- 🎯 **Easy to Use**: Simple popup interface with instant results

## Installation

### For Development/Testing:

1. Download or clone this extension folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your Chrome toolbar

### Usage:

1. **Method 1 - Context Menu**:
   - Select any text on a webpage
   - Right-click and choose "Plagiarism & AI Content Checker"
   - The extension will open with your selected text pre-loaded

2. **Method 2 - Extension Popup**:
   - Click the extension icon in your toolbar
   - Paste or type text into the textarea
   - Click "Analyze Text"

## Features Explained

### Analysis Results:
- **Original Content**: Percentage of text that appears to be originally written
- **AI Generated**: Likelihood that text was created by AI tools
- **Potential Plagiarism**: Probability that text was copied from other sources

### Detailed View:
- Color-coded segments showing different content types
- Confidence scores for each segment
- Potential source URLs (when plagiarism is detected)

## Files Structure:
- `manifest.json` - Extension configuration
- `background.js` - Handles context menu and storage
- `content.js` - Manages text selection on webpages
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality and analysis logic
- `icons/` - Extension icons in various sizes

## Publishing to Chrome Web Store:

1. Zip the entire extension folder
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
3. Pay the one-time $5 developer fee (if not already paid)
4. Upload your zip file
5. Fill out the store listing information
6. Submit for review

## Notes:

- Current version uses mock analysis for demonstration
- Replace the `simulateAnalysis()` function with actual API calls to plagiarism/AI detection services
- Consider implementing rate limiting and error handling for production use
- Add authentication if using paid API services

## Version History:

- v1.0.0 - Initial release with basic functionality