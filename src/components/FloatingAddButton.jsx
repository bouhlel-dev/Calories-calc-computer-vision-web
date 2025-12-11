import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';

const FloatingAddButton = ({ onImageSelect }) => {
  const fileInputRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        e.target.value = '';
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        e.target.value = '';
        return;
      }
      onImageSelect(file);
    }
    // Reset input to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <>
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/jpeg,image/jpg,image/png,image/heic,image/heif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="floating-add-btn">
        <button 
          className="add-btn" 
          onClick={handleClick}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          style={{
            transform: isPressed ? 'scale(0.9)' : 'scale(1)',
            transition: 'transform 0.1s ease'
          }}
          title="Add food photo"
          aria-label="Add food photo"
        >
          <Camera size={28} strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
};

export default FloatingAddButton;
