from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

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

    result = analyze_news(title, author)
    logger.info(f"Analyzed news: {title} by {author} - Result: {result}")

    return jsonify(result=result)

if __name__ == "__main__":
    app.run(debug=True)