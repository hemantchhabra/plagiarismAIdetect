// Popup script for the extension
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const results = document.getElementById('results');
    const charCount = document.getElementById('charCount');

    // Update character count
    function updateCharCount() {
        const count = textInput.value.length;
        charCount.textContent = `${count} characters`;
    }

    // Check for selected text from context menu
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

    // Event listeners
    textInput.addEventListener('input', updateCharCount);
    analyzeBtn.addEventListener('click', analyzeText);
    clearBtn.addEventListener('click', clearText);

    function clearText() {
        textInput.value = '';
        updateCharCount();
        results.innerHTML = '<div class="empty-state">Enter text above or right-click on selected text to analyze for AI generation and plagiarism.</div>';
    }

    function analyzeText() {
        const text = textInput.value.trim();
        if (!text) {
            alert('Please enter some text to analyze.');
            return;
        }

        if (text.length < 50) {
            alert('Please enter at least 50 characters for accurate analysis.');
            return;
        }

        // Show loading state
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'Analyzing...';
        results.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                Analyzing text for AI generation and plagiarism...
            </div>
        `;

        // Simulate analysis (replace with actual API calls)
        setTimeout(() => {
            const analysisResult = simulateAnalysis(text);
            displayResults(analysisResult);
            
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = '🧠 Analyze Text';
        }, 2000);
    }

    function simulateAnalysis(text) {
        // Mock analysis - replace with actual API integration
        const words = text.split(' ').length;
        const sentences = text.split(/[.!?]+/).length;
        
        // Generate mock scores based on text characteristics
        const aiProbability = Math.min(85, Math.max(15, 
            (text.includes('furthermore') ? 20 : 0) +
            (text.includes('moreover') ? 15 : 0) +
            (text.includes('additionally') ? 10 : 0) +
            (words > 200 ? 25 : 10) +
            (sentences > 10 ? 15 : 5) +
            Math.random() * 30
        ));

        const plagiarismScore = Math.min(75, Math.max(5, 
            (text.length > 500 ? 20 : 5) +
            (text.includes('according to') ? 15 : 0) +
            (text.includes('research shows') ? 10 : 0) +
            Math.random() * 40
        ));

        const originalScore = Math.max(20, 100 - aiProbability - plagiarismScore);

        // Generate highlighted segments
        const segments = generateSegments(text, aiProbability, plagiarismScore);

        return {
            aiProbability: Math.round(aiProbability),
            plagiarismScore: Math.round(plagiarismScore),
            originalScore: Math.round(originalScore),
            segments: segments,
            wordCount: words,
            sources: [
                'Wikipedia.org - 85% match',
                'ResearchGate.net - 72% match',
                'Academia.edu - 68% match'
            ]
        };
    }

    function generateSegments(text, aiProb, plagProb) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        const segments = [];
        
        sentences.forEach((sentence, index) => {
            let type = 'original';
            let confidence = Math.random() * 40 + 60;
            
            if (index % 3 === 0 && aiProb > 50) {
                type = 'ai-generated';
                confidence = aiProb + Math.random() * 10 - 5;
            } else if (index % 4 === 0 && plagProb > 30) {
                type = 'plagiarized';
                confidence = plagProb + Math.random() * 10 - 5;
            }
            
            segments.push({
                text: sentence.trim() + '.',
                type: type,
                confidence: Math.round(confidence)
            });
        });
        
        return segments;
    }

    function displayResults(result) {
        results.innerHTML = `
            <div class="score-item original">
                <span class="score-label">Original Content</span>
                <span class="score-value">${result.originalScore}%</span>
            </div>
            <div class="score-item ai-generated">
                <span class="score-label">AI Generated</span>
                <span class="score-value">${result.aiProbability}%</span>
            </div>
            <div class="score-item plagiarized">
                <span class="score-label">Potential Plagiarism</span>
                <span class="score-value">${result.plagiarismScore}%</span>
            </div>
            
            <div style="margin: 16px 0 8px 0; font-weight: 600; font-size: 14px; color: #374151;">
                Detailed Analysis:
            </div>
            
            ${result.segments.map(segment => `
                <div class="segment ${segment.type}">
                    <div class="segment-header">
                        <span>${getTypeLabel(segment.type)}</span>
                        <span>${segment.confidence}%</span>
                    </div>
                    <div>${segment.text}</div>
                </div>
            `).join('')}
            
            ${result.plagiarismScore > 30 ? `
                <div style="margin-top: 16px; padding: 12px; background: #fef2f2; border-radius: 6px; border-left: 4px solid #ef4444;">
                    <div style="font-weight: 600; color: #991b1b; margin-bottom: 8px;">Potential Sources Found:</div>
                    ${result.sources.map(source => `<div style="font-size: 12px; color: #7f1d1d; margin-bottom: 4px;">• ${source}</div>`).join('')}
                </div>
            ` : ''}
        `;
    }

    function getTypeLabel(type) {
        switch(type) {
            case 'ai-generated': return '🤖 AI Generated';
            case 'plagiarized': return '📋 Plagiarized';
            case 'original': return '✍️ Original';
            default: return '❓ Unknown';
        }
    }

    // Initialize character count
    updateCharCount();
});