import React from 'react';
import { X, Utensils, Flame, Apple, Beef, Droplet } from 'lucide-react';

const MealDetailsModal = ({ isVisible, meal, onClose }) => {
  if (!isVisible || !meal) return null;

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Unknown time';
    
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content meal-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-floating" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="meal-details-body">
          {meal.image && (
            <div className="meal-details-image">
              <img src={meal.image} alt="Meal" />
            </div>
          )}
          
          <div className="meal-details-info">
            <div className="detail-section">
              <div className="detail-header">
                <Utensils size={20} />
                <h3>Food Items</h3>
              </div>
              <ul className="food-list">
                {meal.foods.map((food, index) => (
                  <li key={index}>{food}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <div className="detail-header">
                <Flame size={20} />
                <h3>Nutrition Information</h3>
              </div>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <div className="nutrition-icon" style={{ background: 'rgba(255, 107, 157, 0.1)', color: '#ff6b9d' }}>
                    <Flame size={20} />
                  </div>
                  <div className="nutrition-details">
                    <span className="nutrition-label">Calories</span>
                    <span className="nutrition-value">{meal.calories}</span>
                  </div>
                </div>

                <div className="nutrition-item">
                  <div className="nutrition-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                    <Beef size={20} />
                  </div>
                  <div className="nutrition-details">
                    <span className="nutrition-label">Protein</span>
                    <span className="nutrition-value">{meal.protein ? `${Math.round(meal.protein)}g` : 'N/A'}</span>
                  </div>
                </div>

                <div className="nutrition-item">
                  <div className="nutrition-icon" style={{ background: 'rgba(255, 107, 157, 0.1)', color: '#ff6b9d' }}>
                    <Apple size={20} />
                  </div>
                  <div className="nutrition-details">
                    <span className="nutrition-label">Carbs</span>
                    <span className="nutrition-value">{meal.carbs ? `${Math.round(meal.carbs)}g` : 'N/A'}</span>
                  </div>
                </div>

                <div className="nutrition-item">
                  <div className="nutrition-icon" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
                    <Droplet size={20} />
                  </div>
                  <div className="nutrition-details">
                    <span className="nutrition-label">Fats</span>
                    <span className="nutrition-value">{meal.fats ? `${Math.round(meal.fats)}g` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <div className="meal-timestamp">
                Added {formatTime(meal.created_at || meal.timestamp)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetailsModal;
