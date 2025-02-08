function analyzeContent() {
    // Get main article content and metadata
    const articleContent = document.querySelector('article') || document.body;
    const text = articleContent.innerText;
    
    // Try to find the title and author
    const title = document.querySelector('h1')?.innerText || document.title;
    const author = document.querySelector('[rel="author"]')?.innerText || 
                  document.querySelector('.author')?.innerText || 
                  'Unknown';
    
    // Local analysis patterns
    const suspiciousPatterns = [
      /SHOCKING!/i,
      /you won't believe/i,
      /doctors hate this/i,
      /\d{2,}% of people don't know/i,
      /miracle cure/i
    ];
    
    const localAnalysis = {
      sensationalLanguage: suspiciousPatterns.some(pattern => pattern.test(text)),
      hasCitations: text.includes('according to') || 
                   text.includes('researchers found') ||
                   text.includes('studies show'),
      hasDate: /published on|date:|posted:/i.test(text)
    };
  
    // Send to Flask API
    fetch('http://localhost:5000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        author: author
      })
    })
    .then(response => response.json())
    .then(apiResult => {
      // Combine API result with local analysis
      const combinedResults = {
        ...localAnalysis,
        apiResult: apiResult.result,
        url: window.location.href,
        title: title,
        author: author
      };
      
      // Send combined results to popup
      chrome.runtime.sendMessage({
        type: 'analysisResults',
        data: combinedResults
      });
    })
    .catch(error => {
      console.error('API Error:', error);
      // Still send local analysis if API fails
      chrome.runtime.sendMessage({
        type: 'analysisResults',
        data: {
          ...localAnalysis,
          apiResult: 'API_ERROR',
          url: window.location.href,
          title: title,
          author: author
        }
      });
    });
  }
  
  // Run analysis when page loads
  analyzeContent();