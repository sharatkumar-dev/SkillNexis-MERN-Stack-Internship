import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let className = 'toast toast-success';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          className = 'toast toast-error';
        } else if (toast.type === 'info') {
          Icon = Info;
          className = 'toast toast-info';
        }

        return (
          <div key={toast.id} className={className}>
            <Icon size={18} />
            <span>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                marginLeft: 'auto'
              }}
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
