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
        /miracle cure/i,
        /breaking news/i,
        /must read/i,
        /top \d+ reasons/i,
        /exposed!/i,
        /secret revealed/i,
        /going viral/i,
        /this will change your life/i,
        /unbelievable!/i
      ];
    
    const localAnalysis = {
      sensationalLanguage: suspiciousPatterns.some(pattern => pattern.test(text)),
      hasCitations: text.includes('according to') || 
                   text.includes('researchers found') ||
                   text.includes('studies show'),
      hasDate: /published on|date:|posted on :/i.test(text),
      hasAuthor: author !== 'Unknown'
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
  const isAllCaps=/[A-Z]{4,}/.test(title);
  localAnalysis.isAllCapsHeadline=isAllCaps;

  function getPublicationDate() {
    // Check <meta> tags (common in news websites)
    const metaDate = document.querySelector('meta[property="article:published_time"]')?.content ||
                     document.querySelector('meta[name="pubdate"]')?.content ||
                     document.querySelector('meta[name="publish-date"]')?.content ||
                     document.querySelector('meta[name="Posted on"]')?.content ||
                     document.querySelector('meta[name="Published"]')?.content ||
                     document.querySelector('meta[name="date"]')?.content;
  
    if (metaDate) {
      return new Date(metaDate).toISOString(); // Convert to ISO format
    }
  
    // Check <time> tags
    const timeTag = document.querySelector('time[datetime]')?.datetime;
    if (timeTag) {
      return new Date(timeTag).toISOString();
    }
  
    // Check for date-like strings in the article content
    const articleContent = document.querySelector('article')?.innerText || document.body.innerText;
    const datePatterns = [
      /(\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i, // e.g., "10 Oct 2023"
      /(\d{4}-\d{2}-\d{2})/, // e.g., "2023-10-10"
      /(\d{1,2}\/\d{1,2}\/\d{4})/, // e.g., "10/10/2023"
      /(\d{1,2}\.\d{1,2}\.\d{4})/, // e.g., "10.10.2023"
    ];
  
    for (const pattern of datePatterns) {
      const match = articleContent.match(pattern);
      if (match) {
        return new Date(match[0]).toISOString();
      }
    }
  
    return null; // No date found
  }