import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client with proper session management options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage
    persistSession: true,
    // Storage key for session
    storageKey: 'calorie-tracker-auth',
    // Auto refresh token before expiration
    autoRefreshToken: true,
    // Detect session from URL (for OAuth/magic links)
    detectSessionInUrl: true,
    // Flow type for PKCE
    flowType: 'pkce'
  }
});

// Session management functions
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

export const refreshSession = async () => {
  const { data: { session }, error } = await supabase.auth.refreshSession();
  if (error) throw error;
  return session;
};

export const getAccessToken = async () => {
  const session = await getSession();
  return session?.access_token || null;
};

export const isSessionValid = async () => {
  try {
    const session = await getSession();
    if (!session) return false;
    
    // Check if token is expired or about to expire (within 60 seconds)
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const bufferTime = 60; // 60 seconds buffer
    
    if (expiresAt && (expiresAt - now) < bufferTime) {
      // Token is about to expire, try to refresh
      const refreshedSession = await refreshSession();
      return !!refreshedSession;
    }
    
    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
};

export const getSessionExpiry = async () => {
  const session = await getSession();
  if (!session?.expires_at) return null;
  return new Date(session.expires_at * 1000);
};

// Clear all session data
export const clearSession = async () => {
  localStorage.removeItem('calorie-tracker-auth');
  await supabase.auth.signOut();
};

// Auth functions
export const signUp = async (email, password, profileData = null) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Skip email confirmation for immediate login
      emailRedirectTo: window.location.origin
    }
  });
  if (error) throw error;
  
  // If user is confirmed immediately (email confirmation disabled in Supabase settings)
  // or if session exists, save profile and return the data
  if (data.session && data.user && profileData) {
    try {
      await saveUserProfile(data.user.id, profileData);
    } catch (profileError) {
      console.error('Error saving profile during signup:', profileError);
    }
    return { ...data, autoLoggedIn: true };
  }
  
  // If email confirmation is required, try to sign in immediately
  // This works if email confirmation is disabled in Supabase Auth settings
  try {
    const signInResult = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!signInResult.error && signInResult.data.session) {
      // Save profile data after successful auto sign-in
      if (profileData && signInResult.data.user) {
        try {
          await saveUserProfile(signInResult.data.user.id, profileData);
        } catch (profileError) {
          console.error('Error saving profile after auto sign-in:', profileError);
        }
      }
      return { ...signInResult.data, autoLoggedIn: true };
    }
  } catch (e) {
    // If auto sign-in fails, return original signup data
    console.log('Auto sign-in after signup not available - email verification may be required');
  }
  
  // Store profile data temporarily to save after email verification
  if (profileData) {
    localStorage.setItem('pending_profile_data', JSON.stringify(profileData));
  }
  
  return { ...data, autoLoggedIn: false };
};

// Save user profile data to user_settings
export const saveUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        gender: profileData.gender,
        height_cm: profileData.height_cm,
        weight_kg: profileData.weight_kg,
        age: profileData.age,
        goal: profileData.goal,
        target_calories: profileData.target_calories,
        target_protein: profileData.target_protein,
        target_carbs: profileData.target_carbs,
        target_fats: profileData.target_fats,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .maybeSingle();
    
    if (error) {
      // If error is due to missing columns, try saving only the basic targets
      if (error.code === '42703' || error.message?.includes('column')) {
        console.warn('Profile columns not found, saving basic targets only');
        const { data: basicData, error: basicError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: userId,
            target_calories: profileData.target_calories,
            target_protein: profileData.target_protein,
            target_carbs: profileData.target_carbs,
            target_fats: profileData.target_fats,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
          .select()
          .maybeSingle();
        
        if (basicError) {
          console.error('Error saving basic targets:', basicError);
          throw basicError;
        }
        return basicData;
      }
      console.error('Error saving user profile:', error);
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Error in saveUserProfile:', err);
    throw err;
  }
};

// Check and save pending profile data after email verification
export const checkAndSavePendingProfile = async (userId) => {
  const pendingData = localStorage.getItem('pending_profile_data');
  if (pendingData) {
    try {
      const profileData = JSON.parse(pendingData);
      await saveUserProfile(userId, profileData);
      localStorage.removeItem('pending_profile_data');
      return true;
    } catch (error) {
      // Silently fail - profile data will be lost but app will still work
      console.warn('Could not save pending profile data:', error.message);
      localStorage.removeItem('pending_profile_data');
      return false;
    }
  }
  return false;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const deleteAccount = async () => {
  const { error } = await supabase.rpc('delete_user');
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// User settings functions
export const getUserSettings = async (userId) => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching user settings:', error);
    return null;
  }
  return data;
};

export const updateUserSettings = async (userId, settings) => {
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select()
    .maybeSingle();
  
  if (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
  return data;
};

// Meals functions
export const getMealsByDate = async (userId, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startOfDay.toISOString())
    .lte('created_at', endOfDay.toISOString())
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addMeal = async (userId, meal) => {
  const { data, error } = await supabase
    .from('meals')
    .insert({
      user_id: userId,
      foods: meal.foods,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      image: meal.image,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteMeal = async (mealId) => {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId);
  
  if (error) throw error;
};

// Daily summary functions
export const getDailySummary = async (userId, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('meals')
    .select('calories, protein, carbs, fats')
    .eq('user_id', userId)
    .gte('created_at', startOfDay.toISOString())
    .lte('created_at', endOfDay.toISOString());
  
  if (error) throw error;
  
  const summary = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  };
  
  if (data) {
    data.forEach(meal => {
      summary.calories += meal.calories || 0;
      summary.protein += meal.protein || 0;
      summary.carbs += meal.carbs || 0;
      summary.fats += meal.fats || 0;
    });
  }
  
  return summary;
};
