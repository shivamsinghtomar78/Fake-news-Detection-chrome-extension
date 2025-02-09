document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentUrl = tabs[0].url;
    
    chrome.storage.local.get('checkedUrls', function(data) {
      const checkedUrls = data.checkedUrls || [];
      const currentUrlData = checkedUrls.find(item => item.url === currentUrl);
      
      if (currentUrlData) {
        displayResults(currentUrlData.results);
      } else {
        document.getElementById('results').innerHTML = 
          '<p>No analysis available for this page. Please refresh the page to analyze.</p>';
      }
    });
  });
});

function displayResults(results) {
  const resultsDiv = document.getElementById('results');
  const checklistDiv = document.getElementById('checklist');
  
  let correctnessScore = 0;
  if (results.sensationalLanguage === false) correctnessScore++;
  if (results.hasCitations === true) correctnessScore++;
  if (results.hasDate === true) correctnessScore++;
  
  let confidencePercent = (correctnessScore / 3) * 100;
  
  let statusHtml = '';
  if (correctnessScore === 3) {
    statusHtml = `<div class="safe">✓ This news is likely REAL (Confidence: ${confidencePercent.toFixed(0)}%)</div>`;
  } else if (correctnessScore === 2) {
    statusHtml = `<div class="warning">⚠️ This news MAY BE REAL OR FAKE (Confidence: ${confidencePercent.toFixed(0)}%)</div>`;
  } else {
    statusHtml = `<div class="warning">⚠️ This news is likely FAKE (Confidence: ${confidencePercent.toFixed(0)}%)</div>`;
  }
  
  resultsDiv.innerHTML = `
    ${statusHtml}
    <div class="article-info">
      <p><strong>Title:</strong> ${results.title}</p>
      <p><strong>Author:</strong> ${results.author}</p>
    </div>
  `;
  
  checklistDiv.innerHTML = `
    <div class="checklist-item">
      ${results.sensationalLanguage ? '❌' : '✓'} Sensational language
    </div>
    <div class="checklist-item">
      ${results.hasCitations ? '✓' : '❌'} Citations present
    </div>
    <div class="checklist-item">
      ${results.hasDate ? '✓' : '❌'} Publication date found
    </div>
  `;
}