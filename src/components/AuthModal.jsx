import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Calculate BMR using Mifflin-St Jeor Equation
const calculateBMR = (gender, weightKg, heightCm, age) => {
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
};

// Calculate target calories based on goal
const calculateTargetCalories = (bmr, goal) => {
  // Assuming moderate activity level (1.55 multiplier)
  const tdee = bmr * 1.55;
  
  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500); // 500 calorie deficit
    case 'gain':
      return Math.round(tdee + 500); // 500 calorie surplus
    case 'maintain':
    default:
      return Math.round(tdee);
  }
};

// Calculate macro targets based on calories and goal
const calculateMacros = (calories, goal) => {
  let proteinRatio, carbsRatio, fatsRatio;
  
  switch (goal) {
    case 'lose':
      proteinRatio = 0.35; // Higher protein for weight loss
      carbsRatio = 0.35;
      fatsRatio = 0.30;
      break;
    case 'gain':
      proteinRatio = 0.30;
      carbsRatio = 0.45; // Higher carbs for muscle gain
      fatsRatio = 0.25;
      break;
    case 'maintain':
    default:
      proteinRatio = 0.30;
      carbsRatio = 0.40;
      fatsRatio = 0.30;
  }
  
  return {
    protein: Math.round((calories * proteinRatio) / 4), // 4 cal per gram
    carbs: Math.round((calories * carbsRatio) / 4),
    fats: Math.round((calories * fatsRatio) / 9) // 9 cal per gram
  };
};

const AuthModal = ({ isVisible, onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1); // 1 = email/password, 2 = profile
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isVisible) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setGender('');
    setHeight('');
    setWeight('');
    setAge('');
    setGoal('');
    setStep(1);
    setError('');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleBackStep = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate profile data
        if (!gender || !height || !weight || !age || !goal) {
          setError('Please fill in all profile fields');
          setLoading(false);
          return;
        }

        // Calculate targets
        const heightNum = parseFloat(height);
        const weightNum = parseFloat(weight);
        const ageNum = parseInt(age);
        
        const bmr = calculateBMR(gender, weightNum, heightNum, ageNum);
        const targetCalories = calculateTargetCalories(bmr, goal);
        const macros = calculateMacros(targetCalories, goal);

        const profileData = {
          gender,
          height_cm: heightNum,
          weight_kg: weightNum,
          age: ageNum,
          goal,
          target_calories: targetCalories,
          target_protein: macros.protein,
          target_carbs: macros.carbs,
          target_fats: macros.fats
        };

        await onAuthSuccess(email, password, isSignUp, profileData);
      } else {
        await onAuthSuccess(email, password, isSignUp, null);
      }
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onAuthSuccess(email, password, false, null);
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <button 
            type="button" 
            className="back-btn" 
            onClick={isSignUp && step === 2 ? handleBackStep : onClose}
            disabled={loading}
            title={isSignUp && step === 2 ? "Back to credentials" : "Back to landing page"}
          >
            <ArrowLeft size={20} />
          </button>
          <h2>
            {isSignUp 
              ? (step === 1 ? 'Create Account' : 'Your Profile') 
              : 'Sign In'}
          </h2>
        </div>

        {/* Sign In Form */}
        {!isSignUp && (
          <form onSubmit={handleSignIn} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            
            <div className="auth-toggle">
              Don't have an account?{' '}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setIsSignUp(true);
                  setStep(1);
                  setError('');
                }}
                disabled={loading}
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Step 1: Email & Password */}
        {isSignUp && step === 1 && (
          <form onSubmit={handleNextStep} className="auth-form">
            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
              <h6 style={{ color: 'grey' }}>Enter a valid email address - you will receive a verification email...</h6>
            </div>
            
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min 6 characters)"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="submit-btn">
              Next
              <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
            
            <div className="auth-toggle">
              Already have an account?{' '}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setIsSignUp(false);
                  setStep(1);
                  setError('');
                }}
                disabled={loading}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Step 2: Profile */}
        {isSignUp && step === 2 && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Gender</label>
              <div className="radio-group">
                <label className={`radio-option ${gender === 'male' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <span>Male</span>
                </label>
                <label className={`radio-option ${gender === 'female' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <span>Female</span>
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Years"
                  min="15"
                  max="100"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="cm"
                  min="100"
                  max="250"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="kg"
                  min="30"
                  max="300"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Goal</label>
              <div className="goal-options">
                <label className={`goal-option ${goal === 'lose' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="goal"
                    value="lose"
                    checked={goal === 'lose'}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                  <span>Lose Weight</span>
                </label>
                <label className={`goal-option ${goal === 'maintain' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="goal"
                    value="maintain"
                    checked={goal === 'maintain'}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                  <span>Maintain</span>
                </label>
                <label className={`goal-option ${goal === 'gain' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="goal"
                    value="gain"
                    checked={goal === 'gain'}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                  <span>Gain Weight</span>
                </label>
              </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
