import React from 'react';
import { Utensils, Camera } from 'lucide-react';

const MealsList = ({ meals, onMealClick }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const now = new Date();
    const mealTime = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(mealTime.getTime())) return 'Unknown time';
    
    const diffInMinutes = Math.floor((now - mealTime) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return mealTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (meals.length === 0) {
    return (
      <div className="meals-section">
        <div className="meals-header">
          <h2>Recent Meals</h2>
        </div>
        <div className="meals-list">
          <div className="empty-meals" style={{ animation: 'fadeIn 0.5s ease' }}>
            <Utensils size={48} strokeWidth={1.5} color="#666" style={{ marginBottom: '16px' }} />
            <p style={{ fontWeight: '600', color: '#999' }}>No meals added yet</p>
            <p style={{ color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              Tap the <Camera size={16} strokeWidth={2} /> button to add your first meal
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="meals-section">
      <div className="meals-header">
        <h2>Recent Meals</h2>
        <span style={{ fontSize: '0.9rem', color: '#666' }}>{meals.length} {meals.length === 1 ? 'meal' : 'meals'}</span>
      </div>
      <div className="meals-list">
        {meals.map((meal, index) => (
          <div 
            key={meal.id} 
            className="meal-item"
            onClick={() => onMealClick && onMealClick(meal)}
            style={{
              animation: `slideInFromRight 0.4s ease ${index * 0.1}s backwards`,
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <div className="meal-image" style={{ position: 'relative' }}>
              <img src={meal.image} alt="Meal" style={{ transition: 'transform 0.2s ease' }} />
              {meal.foods.length > 1 && (
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  {meal.foods.length} items
                </div>
              )}
            </div>
            <div className="meal-info">
              <div className="meal-foods" style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {meal.foods.join(', ')}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                <div className="meal-calories" style={{ fontWeight: 'bold' }}>{meal.calories} cal</div>
                <div className="meal-time" style={{ fontSize: '0.75rem' }}>
                  {formatTime(meal.created_at || meal.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MealsList;
