# Calorie Tracker - React App

A modern, React-based calorie tracking application with AI-powered food analysis using Google Gemini API.

## Features

- 🔥 Track daily calorie intake
- 📊 Monitor macronutrients (Proteins, Carbs, Fats)
- 📸 AI-powered food image analysis
- 📱 Mobile-responsive design
- 🎨 Modern, dark-themed UI

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

Open `src/services/foodAnalysis.js` and replace `YOUR_GOOGLE_API_KEY` with your actual Google Gemini API key:

```javascript
const apiKey = "YOUR_GOOGLE_API_KEY";
```

To get a Google Gemini API key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste it into the file

### 3. Start Development Server

```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## Project Structure

```
static/
├── index.html              # Main HTML file
├── src/
│   ├── components/         # React components
│   │   ├── Header.js
│   │   ├── CalorieProgress.js
│   │   ├── MacroNutrients.js
│   │   ├── MealsList.js
│   │   ├── FloatingAddButton.js
│   │   ├── AlertModal.js
│   │   └── LoadingSpinner.js
│   ├── services/
│   │   └── foodAnalysis.js # API service
│   ├── styles.css          # Styles
│   ├── App.js              # Main app component
│   └── index.js            # Entry point
├── vite.config.js          # Vite configuration
└── package.json
```

## Usage

1. Click the `+` button to upload a food image
2. The AI will analyze the image and identify food items
3. Calories and macronutrients are automatically calculated
4. View your recent meals and daily progress

## Technologies Used

- **React** - UI library
- **Vite** - Fast build tool and dev server
- **Google Gemini API** - AI-powered food analysis

## Notes

- The app stores data in memory only (resets on page refresh)
- You can modify macro targets in `src/App.js`
- The food analysis uses estimated values for macronutrient distribution

## License

ISC
