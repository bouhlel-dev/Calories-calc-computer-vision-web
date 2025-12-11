import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="loading-spinner">
      <Loader2 
        size={48} 
        strokeWidth={2.5} 
        color="#ff6b9d" 
        style={{ animation: 'spin 1s linear infinite' }} 
      />
    </div>
  );
};

export default LoadingSpinner;
