import React from 'react';
import './StatsCard.css';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, unit }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">
          {value}
          {unit && <span className="stat-unit">{unit}</span>}
        </div>
      </div>
    </div>
  );
}; 