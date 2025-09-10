// Popup script for Chrome extension
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const results = document.getElementById('results');
    const charCount = document.getElementById('charCount');
    
    let isAnalyzing = false;
    
    // Update character count
    function updateCharCount() {
        charCount.textContent = `${textInput.value.length} characters`;
    }
    
    // Load selected text from context menu or storage
    function loadSelectedText() {
        chrome.runtime.sendMessage({ action: "getSelectedText" }, (response) => {
            if (response && response.text) {
                textInput.value = response.text;
                updateCharCount();
                
                // Auto-analyze if requested from context menu
                if (response.autoAnalyze) {
                    analyzeText();
                }
            }
        });
    }
    
    // Mock analysis function (same as original)
    async function performAnalysis(inputText) {
        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const words = inputText.split(/\s+/);
        const segments = [];
        
        let currentSegment = '';
        let segmentTypeIndex = 0;
        const types = ['original', 'ai-generated', 'plagiarized', 'uncertain'];
        
        words.forEach((word, index) => {
            currentSegment += (currentSegment ? ' ' : '') + word;
            
            if (index > 0 && (index % Math.floor(Math.random() * 10 + 15)) === 0) {
                const currentType = types[segmentTypeIndex % types.length];
                const sources = currentType === 'plagiarized' 
                    ? ['example.com', 'wikipedia.org'] 
                    : undefined;
                
                segments.push({
                    text: currentSegment,
                    type: currentType,
                    confidence: Math.random() * 0.4 + 0.6,
                    sources
                });
                
                segmentTypeIndex = Math.floor(Math.random() * types.length);
                currentSegment = '';
            }
        });
        
        if (currentSegment) {
            const currentType = types[segmentTypeIndex % types.length];
            const sources = currentType === 'plagiarized' ? ['example.com'] : undefined;
            
            segments.push({
                text: currentSegment,
                type: currentType,
                confidence: Math.random() * 0.4 + 0.6,
                sources
            });
        }
        
        // Calculate overall scores
        const totalLength = segments.reduce((sum, seg) => sum + seg.text.length, 0);
        let originalLength = 0, aiLength = 0, plagiarismLength = 0;
        
        segments.forEach(seg => {
            switch (seg.type) {
                case 'original':
                    originalLength += seg.text.length;
                    break;
                case 'ai-generated':
                    aiLength += seg.text.length;
                    break;
                case 'plagiarized':
                    plagiarismLength += seg.text.length;
                    break;
            }
        });
        
        return {
            overall: {
                originalScore: Math.round((originalLength / totalLength) * 100),
                aiScore: Math.round((aiLength / totalLength) * 100),
                plagiarismScore: Math.round((plagiarismLength / totalLength) * 100)
            },
            segments
        };
    }
    
    // Display results
    function displayResults(analysisResult) {
        const overviewHTML = `
            <div class="score-item original">
                <span class="score-label">Original Content</span>
                <span class="score-value">${analysisResult.overall.originalScore}%</span>
            </div>
            <div class="score-item ai-generated">
                <span class="score-label">AI Generated</span>
                <span class="score-value">${analysisResult.overall.aiScore}%</span>
            </div>
            <div class="score-item plagiarized">
                <span class="score-label">Potentially Plagiarized</span>
                <span class="score-value">${analysisResult.overall.plagiarismScore}%</span>
            </div>
        `;
        
        let segmentsHTML = '<div style="margin-top: 16px; font-size: 12px; font-weight: 600; color: #374151;">Detailed Analysis:</div>';
        
        analysisResult.segments.forEach((segment, index) => {
            const truncatedText = segment.text.length > 80 
                ? segment.text.substring(0, 80) + '...' 
                : segment.text;
                
            segmentsHTML += `
                <div class="segment ${segment.type}">
                    <div class="segment-header">
                        <span>${getTypeLabel(segment.type)}</span>
                        <span>${Math.round(segment.confidence * 100)}%</span>
                    </div>
                    <div>${truncatedText}</div>
                    ${segment.sources ? `<div style="margin-top: 4px; font-size: 10px; color: #6b7280;">Sources: ${segment.sources.join(', ')}</div>` : ''}
                </div>
            `;
        });
        
        results.innerHTML = overviewHTML + segmentsHTML;
    }
    
    function getTypeLabel(type) {
        switch (type) {
            case 'ai-generated': return 'AI Generated';
            case 'plagiarized': return 'Plagiarized';
            case 'original': return 'Original';
            case 'uncertain': return 'Uncertain';
            default: return 'Unknown';
        }
    }
    
    // Analyze text
    async function analyzeText() {
        const text = textInput.value.trim();
        if (!text) {
            results.innerHTML = '<div class="empty-state">Please enter some text to analyze.</div>';
            return;
        }
        
        isAnalyzing = true;
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = '🔄 Analyzing...';
        
        results.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                Analyzing text for AI generation and plagiarism...
            </div>
        `;
        
        try {
            const analysisResult = await performAnalysis(text);
            displayResults(analysisResult);
        } catch (error) {
            results.innerHTML = '<div class="empty-state" style="color: #ef4444;">Analysis failed. Please try again.</div>';
        } finally {
            isAnalyzing = false;
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = '🧠 Analyze Text';
        }
    }
    
    // Event listeners
    textInput.addEventListener('input', updateCharCount);
    analyzeBtn.addEventListener('click', analyzeText);
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateCharCount();
        results.innerHTML = '<div class="empty-state">Enter text above or right-click on selected text to analyze for AI generation and plagiarism.</div>';
    });
    
    // Initialize
    updateCharCount();
    loadSelectedText();
});