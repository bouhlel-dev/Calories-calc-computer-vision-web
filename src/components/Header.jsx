import React, { useState, useEffect } from 'react';
import { Sunrise, Sun, Moon, CloudMoon, Settings, LogOut, User } from 'lucide-react';

const Header = ({ onSettingsClick, onSignOut, onProfileClick, user }) => {
  const [greeting, setGreeting] = useState({ text: 'hello!', icon: Sun });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting({ text: 'good morning!', icon: Sunrise });
    } else if (hour >= 12 && hour < 17) {
      setGreeting({ text: 'good afternoon!', icon: Sun });
    } else if (hour >= 17 && hour < 22) {
      setGreeting({ text: 'good evening!', icon: Moon });
    } else {
      setGreeting({ text: 'good night!', icon: CloudMoon });
    }
  }, []);

  const GreetingIcon = greeting.icon;

  return (
    <div className="header">
      <h1 className="greeting" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {greeting.text}
        <GreetingIcon size={28} strokeWidth={2} style={{ color: '#ff6b9d' }} />
      </h1>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {user && (
          <button 
            className="settings-btn profile-btn" 
            onClick={onProfileClick} 
            title="My Profile"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <User size={24} strokeWidth={2} style={{ color: '#888' }} />
          </button>
        )}
        <button className="settings-btn" onClick={onSettingsClick} title="Settings" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={24} strokeWidth={2} style={{ color: '#888' }} />
        </button>
        {user && (
          <button className="settings-btn" onClick={onSignOut} title="Sign Out" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={24} strokeWidth={2} style={{ color: '#888' }} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
