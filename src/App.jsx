import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import CalorieProgress from './components/CalorieProgress.jsx';
import MacroNutrients from './components/MacroNutrients.jsx';
import MealsList from './components/MealsList.jsx';
import FloatingAddButton from './components/FloatingAddButton.jsx';
import AlertModal from './components/AlertModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import DateNavigation from './components/DateNavigation.jsx';
import MealDetailsModal from './components/MealDetailsModal.jsx';
import LandingPage from './components/LandingPage.jsx';
import { getBase64, analyzeFoodImage, calculateMacros } from './services/foodAnalysis.js';
import {
  supabase,
  signIn,
  signUp,
  signOut,
  deleteAccount,
  getUserSettings,
  updateUserSettings,
  getMealsByDate,
  addMeal,
  getDailySummary,
  getSession,
  refreshSession,
  isSessionValid,
  clearSession,
  checkAndSavePendingProfile,
  saveUserProfile
} from './services/supabase.js';
import './styles.css';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentCalories, setCurrentCalories] = useState(0);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);
  const [meals, setMeals] = useState([]);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [mealDetailsVisible, setMealDetailsVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [macroTargets, setMacroTargets] = useState({
    protein: 200,
    carbs: 200,
    fats: 150
  });

  // Check for existing session on mount and set up session management
  useEffect(() => {
    let sessionCheckInterval;

    const initializeSession = async () => {
      try {
        // Validate and get current session
        const isValid = await isSessionValid();
        
        if (isValid) {
          const { data: { session } } = await supabase.auth.getSession();
          setUser(session?.user || null);
          if (session?.user) {
            setShowLanding(false);
          }
        } else {
          // Session invalid or expired, clear it
          await clearSession();
          setUser(null);
          setShowLanding(true);
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        setUser(null);
        setShowLanding(true);
      }
    };

    // Initialize session on mount
    initializeSession();

    // Set up periodic session validation (every 5 minutes)
    sessionCheckInterval = setInterval(async () => {
      if (user) {
        try {
          const isValid = await isSessionValid();
          if (!isValid) {
            // Session expired, sign out user
            await clearSession();
            setUser(null);
            setShowLanding(true);
            showAlert('Session Expired', 'Your session has expired. Please sign in again.');
          }
        } catch (error) {
          console.error('Session check error:', error);
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
        setShowLanding(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setApiKey('');
        setMeals([]);
        setCurrentCalories(0);
        setProtein(0);
        setCarbs(0);
        setFats(0);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        setUser(session?.user || null);
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user || null);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
    };
  }, []);

  // Load user settings and meals when user or date changes
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, currentDate]);

  const loadUserData = async () => {
    try {
      // Check and save any pending profile data (from email verification flow)
      await checkAndSavePendingProfile(user.id);
      
      // Load user settings
      const settings = await getUserSettings(user.id);
      setUserSettings(settings);
      
      if (settings?.gemini_api_key) {
        setApiKey(settings.gemini_api_key);
      }
      
      // Load user's custom calorie and macro targets
      if (settings?.target_calories) {
        setTargetCalories(settings.target_calories);
      }
      if (settings?.target_protein || settings?.target_carbs || settings?.target_fats) {
        setMacroTargets({
          protein: settings.target_protein || 200,
          carbs: settings.target_carbs || 200,
          fats: settings.target_fats || 150
        });
      }

      // Load meals for the selected date
      const mealsData = await getMealsByDate(user.id, currentDate);
      setMeals(mealsData);

      // Load daily summary
      const summary = await getDailySummary(user.id, currentDate);
      setCurrentCalories(summary.calories);
      setProtein(summary.protein);
      setCarbs(summary.carbs);
      setFats(summary.fats);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const showAlert = (title, message) => {
    setAlert({ visible: true, title, message });
  };

  const closeAlert = () => {
    setAlert({ visible: false, title: '', message: '' });
  };

  const handleAuth = async (email, password, isSignUp, profileData = null) => {
    try {
      if (isSignUp) {
        const result = await signUp(email, password, profileData);
      } 
      else {
        await signIn(email, password);
      }
    } catch (error) {
      throw new Error(error.message || 'Authentication failed');
    }
  };

  const handleSignOut = async () => {
    try {
      await clearSession();
      setApiKey('');
      setMeals([]);
      setCurrentCalories(0);
      setProtein(0);
      setCarbs(0);
      setFats(0);
      setShowLanding(true);
    } catch (error) {
      showAlert('Error', 'Failed to sign out');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      await clearSession();
      setApiKey('');
      setMeals([]);
      setCurrentCalories(0);
      setProtein(0);
      setCarbs(0);
      setFats(0);
      setSettingsModalVisible(false);
      setShowLanding(true);
      showAlert('Success', 'Account deleted successfully!');
    } catch (error) {
      showAlert('Error', 'Failed to delete account');
      throw error;
    }
  };

  const handleSaveApiKey = async (newApiKey) => {
    try {
      await updateUserSettings(user.id, { gemini_api_key: newApiKey });
      setApiKey(newApiKey);
      showAlert('Success', 'API key saved successfully!');
    } catch (error) {
      showAlert('Error', 'Failed to save API key');
      throw error;
    }
  };

  const handleSaveProfile = async (profileData) => {
    try {
      await saveUserProfile(user.id, profileData);
      // Update local state with new targets
      setTargetCalories(profileData.target_calories);
      setMacroTargets({
        protein: profileData.target_protein,
        carbs: profileData.target_carbs,
        fats: profileData.target_fats
      });
      // Update user settings state
      setUserSettings(prev => ({ ...prev, ...profileData }));
    } catch (error) {
      throw error;
    }
  };

  const handleImageSelect = async (file) => {
    if (!file) {
      showAlert('Error', 'No file selected');
      return;
    }

    if (!apiKey) {
      showAlert('Error', 'Please configure your Gemini API key in settings first');
      setSettingsModalVisible(true);
      return;
    }

    try {
      setLoading(true);
      
      // Convert to base64
      let base64Image;
      try {
        base64Image = await getBase64(file);
      } catch (conversionError) {
        console.error('File conversion error:', conversionError);
        showAlert('Error', 'Failed to process the image. Please try a different image.');
        return;
      }

      // Analyze the image
      let result;
      try {
        result = await analyzeFoodImage(base64Image, apiKey);
      } catch (analysisError) {
        console.error('Analysis error:', analysisError);
        showAlert('Error', analysisError.message || 'Failed to analyze the image.');
        return;
      }
      
      // Calculate macros
      const macros = calculateMacros(result.count);
      
      // Create meal object
      const mealData = {
        foods: result.items,
        calories: result.count,
        protein: macros.protein,
        carbs: macros.carbs,
        fats: macros.fats,
        image: base64Image
      };
      
      // Save to Supabase
      try {
        const savedMeal = await addMeal(user.id, mealData);
        
        // Update local state
        setMeals(prevMeals => [savedMeal, ...prevMeals]);
        setCurrentCalories(prev => prev + result.count);
        setProtein(prev => prev + macros.protein);
        setCarbs(prev => prev + macros.carbs);
        setFats(prev => prev + macros.fats);
        
      } catch (dbError) {
        console.error('Database error:', dbError);
        showAlert('Error', 'Failed to save meal to database');
      }
      
    } catch (error) {
      console.error('Unexpected error:', error);
      showAlert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleMealClick = (meal) => {
    setSelectedMeal(meal);
    setMealDetailsVisible(true);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        if (alert.visible) closeAlert();
        if (settingsModalVisible) setSettingsModalVisible(false);
        if (mealDetailsVisible) setMealDetailsVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [alert.visible, settingsModalVisible, mealDetailsVisible]);

  const handleGetStarted = () => {
    setShowLanding(false);
    setAuthModalVisible(true);
  };

  const handleBackToLanding = () => {
    setAuthModalVisible(false);
    setShowLanding(true);
  };

  if (showLanding && !user) {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} />
        <AuthModal
          isVisible={authModalVisible}
          onClose={handleBackToLanding}
          onAuthSuccess={handleAuth}
        />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} />
        <AuthModal
          isVisible={true}
          onClose={handleBackToLanding}
          onAuthSuccess={handleAuth}
        />
      </>
    );
  }

  return (
    <div className="app-container">
      <Header 
        onSettingsClick={() => setSettingsModalVisible(true)}
        onProfileClick={() => setProfileModalVisible(true)}
        onSignOut={handleSignOut}
        user={user}
      />
      <LoadingSpinner isVisible={loading} />
      
      <div className="main-content">
        <div className="calorie-date-card">
          <DateNavigation 
            currentDate={currentDate}
            onDateChange={handleDateChange}
          />
          
          <CalorieProgress 
            currentCalories={currentCalories}
            targetCalories={targetCalories}
          />
        </div>
        
        <MacroNutrients 
          protein={protein}
          carbs={carbs}
          fats={fats}
          targets={macroTargets}
        />
        
        <MealsList meals={meals} onMealClick={handleMealClick} />
      </div>
      
      <FloatingAddButton onImageSelect={handleImageSelect} />
      
      <AlertModal 
        isVisible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />
      
      <SettingsModal
        isVisible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        currentApiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        onDeleteAccount={handleDeleteAccount}
      />

      <ProfileModal
        isVisible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        userSettings={userSettings}
        onSaveProfile={handleSaveProfile}
        userEmail={user?.email}
      />

      <MealDetailsModal
        isVisible={mealDetailsVisible}
        meal={selectedMeal}
        onClose={() => setMealDetailsVisible(false)}
      />
    </div>
  );
};

export default App;
