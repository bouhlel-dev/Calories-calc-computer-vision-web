import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const SettingsModal = ({ isVisible, onClose, currentApiKey, onSaveApiKey, onDeleteAccount }) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setApiKey(currentApiKey || '');
      setSuccess(false);
    }
  }, [isVisible, currentApiKey]);

  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSaveApiKey(apiKey);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to save API key:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await onDeleteAccount();
    } catch (err) {
      console.error('Failed to delete account:', err);
      alert('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Settings</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="apiKey">Gemini API Key</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              required
              disabled={loading}
            />
            <small className="form-help">
              Get your API key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google AI Studio
              </a>
            </small>
          </div>
          
          {success && <div className="success-message">API key saved successfully!</div>}
          
          <div className="button-group">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save API Key'}
            </button>
            <button type="button" className="close-btn" onClick={onClose} disabled={loading}>
              Close
            </button>
          </div>

          <details className="danger-zone">
          <summary>Danger Zone</summary>
          <div className="danger-zone-content">
            <p>Permanently delete your account and all associated data.</p>
            {!showDeleteConfirm ? (
              <button 
                type="button" 
                className="delete-account-btn" 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            ) : (
              <div className="delete-confirm">
                <p style={{ color: '#ff4444', fontWeight: 'bold', marginBottom: '10px' }}>
                  Are you sure? This action cannot be undone!
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    className="delete-confirm-btn" 
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                  </button>
                  <button 
                    type="button" 
                    className="delete-cancel-btn" 
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </details>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
