import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast rendering portal */}
      <div className="toast-container-custom">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-custom ${toast.type}`}>
            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                fontSize: '1.2rem',
                cursor: 'pointer',
                lineHeight: 1,
                paddingLeft: '1rem',
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
