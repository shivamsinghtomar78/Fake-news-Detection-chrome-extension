# 📰 Fake News Detector - Chrome Extension

  ![Status](https://img.shields.io/badge/status-active-success)

> **Detect fake news instantly while browsing!** This Chrome extension analyzes web content in real-time, providing insights into credibility using AI and trusted sources. 🚀

---

## 🎯 **Features**
✅ **Real-time Fake News Detection** – Scans articles as you browse 🕵️‍♂️  
✅ **Sentiment Analysis** – Analyzes article tone using AI 🤖  
✅ **Trusted Source Verification** – Checks against fact-checking websites ✅  
✅ **User-Friendly Popup** – Displays results with intuitive UI 🎨  
✅ **Dynamic Score System** – Rates articles based on credibility 📊  


## 🚀 **Installation Guide**

1. **Clone this repository:**
   ```sh
   git clone https://github.com/yourusername/fake-news-detector.git
   cd fake-news-detector
   ```
2. **Install dependencies for Flask API (Backend):**
   ```sh
   pip install -r requirements.txt
   ```
3. **Run the Flask server:**
   ```sh
   python app.py
   ```
4. **Load the Chrome Extension:**
   - Open **Chrome** and go to `chrome://extensions/`
   - Enable **Developer Mode** (toggle in the top-right)
   - Click **Load unpacked** and select the `extension/` folder
   - You're ready to go! 🎉

---

## ⚙️ **How It Works**
1. **Content Script** scans articles and extracts key details (title, author, etc.).
2. **Local Analysis** checks for sensational language, citations, and metadata.
3. **Flask API** performs **sentiment analysis & trusted source verification**.
4. **Popup UI** displays results dynamically with animations.
5. **Chrome Storage** keeps track of previously analyzed URLs.

---

## 🔥 **Technologies Used**
- **Frontend:** HTML, CSS, JavaScript (Popup UI & Content Script)
- **Backend:** Flask, Python (AI Analysis)
- **Storage:** Chrome Local Storage API
- **Machine Learning:** TextBlob (Sentiment Analysis)

---

## 🎯 **Future Enhancements**
🔹 Advanced **ML-based Fake News Detection** using NLP 🤖  
🔹 **User Feedback System** for improving accuracy ✨  
🔹 Dark Mode & Customizable UI 🌙  
🔹 More Fact-Checking Source Integrations 📡  

### ⭐ _If you like this project, don’t forget to star it! ⭐_

