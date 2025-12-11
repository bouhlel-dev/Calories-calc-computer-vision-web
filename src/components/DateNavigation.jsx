import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateNavigation = ({ currentDate, onDateChange }) => {
  const formatDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
    
    if (diffDays === 0) return 'Today';
    
    return `${dayOfWeek}, ${monthDay}`;
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const current = new Date(currentDate);
    current.setHours(0, 0, 0, 0);
    return today.getTime() === current.getTime();
  };

  return (
    <div className="date-navigation">
      <button className="nav-btn" onClick={goToPreviousDay} title="Previous day">
        <ChevronLeft size={24} />
      </button>
      
      <div className="date-display">
        <span className="date-text">{formatDate(currentDate)}</span>
        {!isToday() && (
          <button className="today-btn" onClick={goToToday}>
            Go back to today
          </button>
        )}
      </div>
      
      <button className="nav-btn" onClick={goToNextDay} title="Next day">
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default DateNavigation;
