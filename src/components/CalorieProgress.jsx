import React, { useEffect, useRef, useState } from 'react';
import { Flame, AlertTriangle } from 'lucide-react';

const CalorieProgress = ({ currentCalories, targetCalories }) => {
  const progressCircleRef = useRef(null);
  const [animatedCalories, setAnimatedCalories] = useState(0);
  const caloriesLeft = Math.max(0, targetCalories - currentCalories);
  const percentage = Math.min(Math.round((currentCalories / targetCalories) * 100), 100);
  const isOverTarget = currentCalories > targetCalories;

  useEffect(() => {
    if (progressCircleRef.current) {
      const progress = Math.min(currentCalories / targetCalories, 1);
      const circumference = 2 * Math.PI * 80;
      const offset = circumference - (progress * circumference);
      progressCircleRef.current.style.strokeDashoffset = offset;
    }

    // Animate calorie count
    const duration = 800;
    const steps = 30;
    const increment = (currentCalories - animatedCalories) / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step < steps) {
        setAnimatedCalories(prev => prev + increment);
      } else {
        setAnimatedCalories(currentCalories);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [currentCalories, targetCalories]);

  return (
    <div className="calorie-section">
      <div className="progress-circle">
        <div className="progress-ring">
          <svg className="progress-svg" width="200" height="200">
            <circle className="progress-bg" cx="100" cy="100" r="80" strokeWidth="8"></circle>
            <circle 
              ref={progressCircleRef}
              className="progress-fill" 
              cx="100" 
              cy="100" 
              r="80" 
              strokeWidth="8"
              style={{
                stroke: isOverTarget ? '#ff4757' : '#ff6b9d',
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease'
              }}
            ></circle>
          </svg>
          <div className="progress-content">
            <div className="flame-icon" style={{ transition: 'all 0.3s ease' }}>
              <Flame 
                size={isOverTarget ? 32 : 28} 
                strokeWidth={2.5}
                fill={isOverTarget ? '#ff4757' : '#ff6b9d'}
                color={isOverTarget ? '#ff4757' : '#ff6b9d'}
                style={{ transition: 'all 0.3s ease' }}
              />
            </div>
            <div className="calorie-count">
              <span style={{ color: isOverTarget ? '#ff4757' : 'white' }}>{Math.round(animatedCalories)}</span> / <span>{targetCalories}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '4px' }}>{percentage}%</div>
          </div>
        </div>
      </div>
      <div className="calories-left" style={{ color: isOverTarget ? '#ff4757' : '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        {isOverTarget ? (
          <>
            <AlertTriangle size={18} strokeWidth={2} />
            <span>{Math.round(currentCalories - targetCalories)}</span> Calories Over
          </>
        ) : (
          <><span>{caloriesLeft}</span> Calories Left</>
        )}
      </div>
    </div>
  );
};

export default CalorieProgress;
