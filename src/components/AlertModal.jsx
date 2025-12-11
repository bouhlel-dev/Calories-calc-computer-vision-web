import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const AlertModal = ({ isVisible, title, message, onClose }) => {
  if (!isVisible) return null;

  const isSuccess = title === 'Success';
  const iconStyle = {
    background: isSuccess ? '#dcfce7' : '#fee2e2',
    color: isSuccess ? '#16a34a' : '#dc2626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal')) {
      onClose();
    }
  };

  return (
    <div className="modal alert-modal" onClick={handleOverlayClick}>
      <div className="modal-overlay"></div>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-icon" style={iconStyle}>
            {isSuccess ? (
              <CheckCircle2 size={24} strokeWidth={2.5} />
            ) : (
              <XCircle size={24} strokeWidth={2.5} />
            )}
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
