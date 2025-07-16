import React from 'react';
import type { TimescaleOption } from '../../hooks/useTemperatureChart';
import './TimescaleSelector.css';

interface TimescaleSelectorProps {
  selectedTimescale: string;
  timescales: TimescaleOption[];
  onTimescaleChange: (timescale: string) => void;
}

export const TimescaleSelector: React.FC<TimescaleSelectorProps> = ({
  selectedTimescale,
  timescales,
  onTimescaleChange,
}) => {
  return (
    <div className="timescale-selector">
      <label htmlFor="timescale">Time Range: </label>
      <select
        id="timescale"
        value={selectedTimescale}
        onChange={(e) => onTimescaleChange(e.target.value)}
        className="timescale-select"
      >
        {timescales.map((timescale) => (
          <option key={timescale.value} value={timescale.value}>
            {timescale.label}
          </option>
        ))}
      </select>
    </div>
  );
}; 