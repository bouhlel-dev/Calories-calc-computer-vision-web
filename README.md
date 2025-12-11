# CalTrack - Calorie Tracking App

A modern, React-based calorie tracking application with AI-powered food analysis using Google Gemini API and Supabase for authentication and data persistence.

## Features

- 🔥 **Personalized Calorie Goals** - Calculated using the Mifflin-St Jeor equation based on your profile
- 📊 **Macro Tracking** - Monitor proteins, carbs, and fats with visual progress bars
- 📸 **AI Food Analysis** - Snap a photo and let Google Gemini identify foods and estimate calories
- 📅 **Date Navigation** - Track meals across different days
- 👤 **User Profiles** - Store your gender, age, height, weight, and fitness goal
- 🔐 **Secure Authentication** - Email/password auth with Supabase
- 📱 **Responsive Design** - Beautiful bento-grid layout on desktop, mobile-optimized view on phones
- 🎨 **Dark Theme UI** - Modern, eye-friendly dark interface

## Tech Stack

- **React 18** - UI library
- **Vite 5** - Fast build tool and dev server
- **Supabase** - Authentication & PostgreSQL database
- **Google Gemini 2.0 Flash** - AI-powered food image analysis
- **Lucide React** - Icon library

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a Supabase project and set up the database:

1. Go to [Supabase](https://supabase.com) and create a new project
2. Run the SQL schema from `supabase_schema.sql` in the SQL Editor
3. Update `src/services/supabase.js` with your project URL and anon key:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

### 3. Configure Gemini API Key

The API key is stored per-user in the app settings. To get a key:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Enter it in the app's Settings modal after signing in

### 4. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## Project Structure

```
caloriewebcalc/
├── index.html
├── package.json
├── vite.config.js
├── supabase_schema.sql      # Database schema
├── public/
├── src/
│   ├── App.jsx              # Main app component
│   ├── index.jsx            # Entry point
│   ├── styles.css           # All styles
│   ├── components/
│   │   ├── AlertModal.jsx
│   │   ├── AuthModal.jsx       # 2-step signup flow
│   │   ├── CalorieProgress.jsx # Circular progress display
│   │   ├── DateNavigation.jsx  # Date picker
│   │   ├── FloatingAddButton.jsx
│   │   ├── Header.jsx
│   │   ├── LandingPage.jsx     # Welcome page
│   │   ├── LoadingSpinner.jsx
│   │   ├── MacroNutrients.jsx
│   │   ├── MealDetailsModal.jsx
│   │   ├── MealsList.jsx
│   │   ├── ProfileModal.jsx    # Edit profile
│   │   └── SettingsModal.jsx
│   └── services/
│       ├── foodAnalysis.js  # Gemini API integration
│       └── supabase.js      # Auth & database
```

## Usage

1. **Sign Up** - Create an account with email and set your profile (gender, age, height, weight, goal)
2. **Configure API Key** - Add your Gemini API key in Settings
3. **Add Meals** - Click the `+` button to photograph food
4. **Track Progress** - View your daily calories and macros
5. **Navigate Dates** - Use arrows to view different days

## Calorie Calculation

The app calculates your daily calorie target using:

- **BMR** (Basal Metabolic Rate) via Mifflin-St Jeor equation
- **TDEE** (Total Daily Energy Expenditure) with 1.55 activity multiplier
- **Goal adjustment**: -500 cal for weight loss, +500 for gain

## Environment Variables

For production deployment, configure these in your hosting platform:

- Supabase URL and anon key in `src/services/supabase.js`
- Update Supabase **Site URL** and **Redirect URLs** to your production domain

