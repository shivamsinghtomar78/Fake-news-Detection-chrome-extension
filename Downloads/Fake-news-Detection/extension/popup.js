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
  
  // Calculate warning level based on both API and local analysis
  let warningLevel = 0;
  if (results.sensationalLanguage) warningLevel += 2;
  if (!results.hasCitations) warningLevel += 1;
  if (!results.hasDate) warningLevel += 1;
  if (results.apiResult === 'FAKE') warningLevel += 3;
  
  let statusHtml = '';
  if (results.apiResult === 'API_ERROR') {
    statusHtml = '<div class="warning">⚠️ Could not connect to verification service</div>';
  } else if (warningLevel >= 4) {
    statusHtml = '<div class="warning">⚠️ High risk of fake news</div>';
  } else if (warningLevel >= 2) {
    statusHtml = '<div class="warning">⚠️ Some suspicious patterns detected</div>';
  } else {
    statusHtml = '<div class="safe">✓ Content appears reliable</div>';
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
    <div class="checklist-item">
      ${results.apiResult === 'REAL' ? '✓' : '❌'} Trusted source verification
    </div>
  `;
}