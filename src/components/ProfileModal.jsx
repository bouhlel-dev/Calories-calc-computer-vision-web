import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

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
  const tdee = bmr * 1.55;
  
  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500);
    case 'gain':
      return Math.round(tdee + 500);
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
      proteinRatio = 0.35;
      carbsRatio = 0.35;
      fatsRatio = 0.30;
      break;
    case 'gain':
      proteinRatio = 0.30;
      carbsRatio = 0.45;
      fatsRatio = 0.25;
      break;
    case 'maintain':
    default:
      proteinRatio = 0.30;
      carbsRatio = 0.40;
      fatsRatio = 0.30;
  }
  
  return {
    protein: Math.round((calories * proteinRatio) / 4),
    carbs: Math.round((calories * carbsRatio) / 4),
    fats: Math.round((calories * fatsRatio) / 9)
  };
};

const ProfileModal = ({ isVisible, onClose, userSettings, onSaveProfile, userEmail }) => {
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load existing settings when modal opens
  useEffect(() => {
    if (isVisible && userSettings) {
      setGender(userSettings.gender || '');
      setHeight(userSettings.height_cm?.toString() || '');
      setWeight(userSettings.weight_kg?.toString() || '');
      setAge(userSettings.age?.toString() || '');
      setGoal(userSettings.goal || '');
    }
  }, [isVisible, userSettings]);

  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!gender || !height || !weight || !age || !goal) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

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

      await onSaveProfile(profileData);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
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
            onClick={onClose}
            disabled={loading}
            title="Close"
          >
            <ArrowLeft size={20} />
          </button>
          <h2>My Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Display */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={userEmail || ''}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          {/* Gender Selection */}
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
                  disabled={loading}
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
                  disabled={loading}
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          {/* Age, Height, Weight */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="profile-age">Age</label>
              <input
                id="profile-age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Years"
                min="15"
                max="100"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="profile-height">Height (cm)</label>
              <input
                id="profile-height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="cm"
                min="100"
                max="250"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="profile-weight">Weight (kg)</label>
              <input
                id="profile-weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="kg"
                min="30"
                max="300"
                disabled={loading}
              />
            </div>
          </div>

          {/* Goal Selection */}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
                <span>Gain Weight</span>
              </label>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
