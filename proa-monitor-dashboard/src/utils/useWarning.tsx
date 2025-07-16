import React, { useCallback, useState } from 'react';

export interface WarningMessage {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  content: string;
  timestamp: Date;
}

export interface UseWarningReturn {
  warnings: WarningMessage[];
  addWarning: (type: WarningMessage['type'], content: string) => void;
  removeWarning: (id: string) => void;
  clearWarnings: () => void;
  WarningDisplay: React.FC;
}

export const useWarning = (): UseWarningReturn => {
  const [warnings, setWarnings] = useState<WarningMessage[]>([]);

  const addWarning = useCallback((type: WarningMessage['type'], content: string) => {
    const newWarning: WarningMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    
    setWarnings(prev => [...prev, newWarning]);
    
    // Auto-remove warning after 5 seconds
    setTimeout(() => {
      setWarnings(prev => prev.filter(w => w.id !== newWarning.id));
    }, 5000);
  }, []);

  const removeWarning = useCallback((id: string) => {
    setWarnings(prev => prev.filter(w => w.id !== id));
  }, []);

  const clearWarnings = useCallback(() => {
    setWarnings([]);
  }, []);

  const WarningDisplay: React.FC = () => {
    if (warnings.length === 0) return null;

    return (
      <div className="warning-container">
        {warnings.map((warning) => (
          <div
            key={warning.id}
            className={`warning-message warning-message--${warning.type}`}
          >
            <div className="warning-content">
              <div className="warning-icon">
                {warning.type === 'warning' && '⚠️'}
                {warning.type === 'error' && '🚨'}
                {warning.type === 'info' && 'ℹ️'}
                {warning.type === 'success' && '✅'}
              </div>
              <div className="warning-text">
                <div className="warning-title">
                  {warning.type === 'warning' && 'Warning'}
                  {warning.type === 'error' && 'Error'}
                  {warning.type === 'info' && 'Info'}
                  {warning.type === 'success' && 'Success'}
                </div>
                <div className="warning-message-text">{warning.content}</div>
              </div>
            </div>
            <button
              className="warning-close"
              onClick={() => removeWarning(warning.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    );
  };

  return {
    warnings,
    addWarning,
    removeWarning,
    clearWarnings,
    WarningDisplay,
  };
}; 