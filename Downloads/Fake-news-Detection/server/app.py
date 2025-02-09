from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from textblob import TextBlob
def analyze_setiment(text):
    """ Simple sentiment analysis using TextBlob. """
    analysis = TextBlob(text)
    return analysis.sentiment.polarity
def analyze_news(title, author):
    sentiment = analyze_setiment(title)
    if sentiment <-0.5:
        return "Fake"
    elif sentiment > 0.5:
        return "POTENIALLY FAKE"
    return "UNKNOWN"
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Trusted news sources
TRUSTED_SOURCES = [
    "factcheck.org",
    "snopes.com",
    "politifact.com",
    "bbc.com",
    "cnn.com",
    "reuters.com",
    "nytimes.com",
    "theguardian.com",
    "aljazeera.com"
]

def analyze_news(title, author):
    """ Simple analysis based on trusted sources. """
    # Here you would implement your logic to check against trusted sources
    # For demonstration, we will just return a dummy response
    if any(source in title.lower() for source in TRUSTED_SOURCES):
        return "REAL"
    else:
        return "FAKE"

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    title = data.get('title')
    author = data.get('author')
    publication_date = data.get('publicationDate')

    # Add publication date to the analysis logic
    if publication_date and publication_date != 'Unknown':
        result = "REAL"  # Assume articles with dates are more credible
    else:
        result = "POTENTIALLY FAKE"

    return jsonify(result=result)

if __name__ == "__main__":
    app.run(debug=True)