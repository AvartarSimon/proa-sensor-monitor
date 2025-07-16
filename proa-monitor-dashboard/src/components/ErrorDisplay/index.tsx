import React from 'react';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  title?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  title = 'Error Loading Data' 
}) => {
  return (
    <div className="error-display">
      <h3 className="error-title">{title}</h3>
      <p className="error-message">{error}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}; 