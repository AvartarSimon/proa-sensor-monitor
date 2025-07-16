import React from 'react';
import { ErrorDisplay } from '../../../components/ErrorDisplay';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { useSensorControl } from '../../../hooks/useSensorControl';
import { useWarning } from '../../../utils/useWarning';
import './SensorControl.css';

interface SensorControlProps {
  className?: string;
}

const SensorControl: React.FC<SensorControlProps> = ({ className }) => {
  const {
    sensorStatus,
    loading,
    error,
    controlLoading,
    toggleSensor,
    updatePeriod,
    updateAmplitude,
  } = useSensorControl();

  const { addWarning, WarningDisplay } = useWarning();

  const handlePeriodChange = async (period: number) => {
    const result = await updatePeriod(period);
    if (result?.success) {
      addWarning('success', 'Period updated successfully');
    } else {
      addWarning('error', result?.message || 'Failed to update period');
    }
  };

  const handleAmplitudeChange = async (amplitude: number) => {
    const result = await updateAmplitude(amplitude);
    if (result?.success) {
      addWarning('success', 'Amplitude updated successfully');
    } else {
      addWarning('error', result?.message || 'Failed to update amplitude');
    }
  };

  const handleToggleSensor = async () => {
    const result = await toggleSensor();
    if (result?.success) {
      addWarning('success', `Sensor ${sensorStatus?.running ? 'stopped' : 'started'} successfully`);
    } else {
      addWarning('error', result?.message || 'Failed to toggle sensor');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading sensor status..." />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        title="Sensor Control Error"
      />
    );
  }

  if (!sensorStatus) {
    return <div className="no-sensor-data">No sensor data available</div>;
  }

  return (
    <div className={`sensor-control ${className}`}>
      <WarningDisplay />
      
      <div className="control-header">
        <div className="control-icon">⚙️</div>
        <h3>Sensor Control</h3>
        <div className={`status-indicator ${sensorStatus.sensorConnection.isConnected ? 'connected' : 'disconnected'}`}>
          {sensorStatus.sensorConnection.isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Control Form */}
      <div className="control-form">
        <div className="form-group">
          <label htmlFor="period">Period (ms):</label>
          <input
            type="range"
            id="period"
            min="100"
            max="10000"
            step="100"
            value={sensorStatus.period}
            onChange={(e) => handlePeriodChange(parseInt(e.target.value))}
            disabled={controlLoading}
          />
          <span className="value-display">{sensorStatus.period}ms</span>
        </div>

        <div className="form-group">
          <label htmlFor="amplitude">Amplitude (°C):</label>
          <input
            type="range"
            id="amplitude"
            min="0"
            max="50"
            step="1"
            value={sensorStatus.amplitude}
            onChange={(e) => handleAmplitudeChange(parseInt(e.target.value))}
            disabled={controlLoading}
          />
          <span className="value-display">{sensorStatus.amplitude}°C</span>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <div className="status-controls">
            <button
              type="button"
              className={`status-btn ${sensorStatus.running ? 'active' : ''}`}
              onClick={handleToggleSensor}
              disabled={controlLoading}
            >
              {sensorStatus.running ? '⏸️' : '▶️'}
              {sensorStatus.running ? 'Running' : 'Stopped'}
            </button>
          </div>
        </div>
      </div>

      {/* Connection Info */}
      {sensorStatus.sensorConnection.lastFailureTime && (
        <div className="connection-info">
          <h4>Connection Information</h4>
          <p>
            <strong>Last Failure:</strong>{' '}
            {new Date(sensorStatus.sensorConnection.lastFailureTime).toLocaleString()}
          </p>
          {sensorStatus.sensorConnection.lastFailureMessage && (
            <p>
              <strong>Error:</strong> {sensorStatus.sensorConnection.lastFailureMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SensorControl;
