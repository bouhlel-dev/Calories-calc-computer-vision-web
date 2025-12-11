# Calorie Tracker with Computer Vision

A modern calorie tracking application that uses Google's Gemini AI to analyze food images and automatically calculate nutritional information. Features user authentication, daily tracking with date navigation, and secure API key storage. **Fully static - no backend required!**

## Features

- 🔐 **User Authentication** - Secure sign up/sign in with Supabase
- 📸 **Food Image Analysis** - AI-powered food recognition using Gemini 2.0 Flash
- 📊 **Nutrition Tracking** - Track calories, protein, carbs, and fats
- 📅 **Day Navigation** - Swipe through previous and upcoming days
- ⚙️ **Settings** - Securely store your Gemini API key
- 💾 **Cloud Storage** - All data synced to Supabase database
- 📱 **Responsive Design** - Works on desktop and mobile
- 🚀 **Static Hosting** - Deploy anywhere (Vercel, Netlify, GitHub Pages, etc.)

## Setup Instructions

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to **Settings** → **API**
3. Copy your **Project URL** and **anon/public key**
4. Go to **SQL Editor** and run the schema from `supabase_schema.sql`

### 2. Environment Configuration

1. Navigate to the `static` folder
2. Create a `.env` file based on `.env.example`:
```bash
cd static
cp .env.example .env
```

3. Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
cd static
npm install
```

### 4. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. You'll configure this in the app settings after signing in

### 5. Run the Application

```bash
cd static
npm run dev
```

This starts the Vite dev server (usually on `http://localhost:3000`)

### 6. First Time Setup

1. Open the app in your browser
2. Sign up for a new account
3. Click the **Settings** icon in the header
4. Paste your Gemini API key
5. Start adding meals by clicking the **+** button!

## Deployment

Since this is a fully static app, you can deploy it to any static hosting service:

### Vercel
```bash
cd static
npm run build
# Deploy the 'dist' folder to Vercel
```

### Netlify
```bash
cd static
npm run build
# Deploy the 'dist' folder to Netlify
```

### GitHub Pages
```bash
cd static
npm run build
# Push the 'dist' folder to gh-pages branch
```

**Important**: Make sure to set your environment variables in your hosting platform's dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Usage

### Adding a Meal
1. Click the floating **+** button
2. Select a food image from your device
3. The AI will analyze it and add it to your daily log

### Navigating Days
- Use the **←** and **→** arrows to view previous/next days
- Click **Today** to jump back to the current day

### Managing Settings
- Click the **Settings** icon to update your API key
- Click the **Sign Out** icon to log out

## Database Schema

### Tables

**user_settings**
- Stores user-specific settings including encrypted API key
- One row per user

**meals**
- Stores all meal entries with nutritional data
- Associated with user via foreign key
- Includes timestamp for day-based queries

## Technology Stack

- **Frontend**: React, Vite, Lucide Icons
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini 2.0 Flash (client-side API calls)

## Security Notes

- API keys are stored securely in Supabase with Row Level Security
- Gemini API calls made directly from the browser (user's own API key)
- User data is isolated through RLS policies
- No backend server required - fully static deployment

## Development

### Dev Server
```bash
cd static
npm run dev
```

### Build for Production
```bash
cd static
npm run build
```

### Preview Production Build
```bash
cd static
npm run preview
```

## Troubleshooting

### API Errors
- Make sure your Gemini API key is configured in settings
- Verify the API key has proper permissions in Google AI Studio
- Check browser console for detailed error messages

### Database Errors
- Verify your Supabase credentials in `.env`
- Ensure the SQL schema has been run in your Supabase project
- Check that RLS policies are enabled

### Authentication Issues
- Confirm your Supabase URL and anon key are correct
- Check email verification if sign up isn't working
- Verify your Supabase project allows email authentication

### Build Errors
- Make sure all environment variables are set
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## License

ISC
