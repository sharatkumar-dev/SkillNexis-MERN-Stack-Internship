import React from 'react';

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast-notification" role="status" aria-live="polite">
      <div className="toast-notification__content">
        <span className="toast-icon">✨</span>
        <span className="toast-text">{message}</span>
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Dismiss notice"
      >
        ✕
      </button>
    </div>
  );
}
