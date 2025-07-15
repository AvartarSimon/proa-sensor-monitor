import { Pause, Play, RotateCcw, Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { SensorControlType, SensorStatus } from '../../../services/sensorDataApi';
import { sensorDataApi } from '../../../services/sensorDataApi';
import { useWarnMessage } from '../../../utils/useWarnMessage';
interface SensorControlProps {
  className?: string;
}

const SensorControl: React.FC<SensorControlProps> = ({ className }) => {
  const [sensorStatus, setSensorStatus] = useState<SensorStatus | null>(null);
  const [controls, setControls] = useState<SensorControlType>({
    period: 1000,
    amplitude: 10,
    status: true,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { showMessage, contextHolder } = useWarnMessage();
  // Fetch sensor status on mount and periodically
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await sensorDataApi.getSensorStatus();
        console.log('Sensor status received:', status);
        setSensorStatus(status);
        if (status?.sensorConnection?.isConnected) {
          setError(null); // Clear any previous errors
        }
      } catch (err) {
        console.error('Error fetching sensor status:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load sensor status: ${errorMessage}`);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!sensorStatus?.sensorConnection?.isConnected) {
      showMessage({
        type: 'error',
        content:
          'Sensor is not connected, please check the sensor or the link!\\n(Proa AI System has got the notice,will check the sensor immediately)',
      });
    }
  }, [sensorStatus]);
  // Handle control changes
  const handleControlChange = (field: keyof SensorControlType, value: number | boolean) => {
    setControls((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Apply controls to sensor
  const applyControls = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await sensorDataApi.controlSensor(controls);
      setSuccess('Sensor controls updated successfully');
    } catch (err) {
      console.error('Error controlling sensor:', err);
      setError('Failed to update sensor controls');
    } finally {
      setLoading(false);
    }
  };

  // Toggle sensor status
  const toggleSensor = async () => {
    const newStatus = !controls.status;
    setControls((prev) => ({ ...prev, status: newStatus }));
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sensorDataApi.controlSensor({ status: newStatus });
      setSuccess(`Sensor ${newStatus ? 'started' : 'stopped'} successfully`);
    } catch (err) {
      console.error('Error toggling sensor:', err);
      setError('Failed to toggle sensor status');
    } finally {
      setLoading(false);
    }
  };

  // Reset to default values
  const resetToDefaults = () => {
    setControls({
      period: 1000,
      amplitude: 10,
      status: true,
    });
  };

  return (
    <div className={`sensor-control ${className}`}>
      <div className="control-header">
        <Settings className="control-icon" />
        <h3>Sensor Control</h3>
        {sensorStatus && (
          <div
            className={`status-indicator ${
              sensorStatus.sensorConnection?.isConnected ? 'connected' : 'disconnected'
            }`}
          >
            {sensorStatus.sensorConnection?.isConnected ? 'Connected' : 'Disconnected'}
          </div>
        )}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <p>{success}</p>
          <button onClick={() => setSuccess(null)}>Dismiss</button>
        </div>
      )}

      {/* Control Form */}
      <div className="control-form">
        <div className="form-group">
          {contextHolder}
          <label htmlFor="period">Period (ms):</label>
          <input
            type="range"
            id="period"
            min="0"
            max="10000"
            step="500"
            value={controls.period}
            onChange={(e) => handleControlChange('period', parseInt(e.target.value))}
            disabled={loading}
          />
          <span className="value-display">{controls.period}ms</span>
        </div>

        <div className="form-group">
          <label htmlFor="amplitude">Amplitude (°C):</label>
          <input
            type="range"
            id="amplitude"
            min="0"
            max="50"
            step="1"
            value={controls.amplitude}
            onChange={(e) => handleControlChange('amplitude', parseInt(e.target.value))}
            disabled={loading}
          />
          <span className="value-display">{controls.amplitude}°C</span>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <div className="status-controls">
            <button
              type="button"
              className={`status-btn ${controls.status ? 'active' : ''}`}
              style={{ border: 'none', background: controls.status ? '#FCA5A5' : '#A7F3D0' }}
              onClick={toggleSensor}
              disabled={loading}
            >
              {controls.status ? (
                <Pause size={16} style={{ paddingTop: '3.5px' }} />
              ) : (
                <Play size={16} style={{ paddingTop: '3.5px' }} />
              )}
              {controls.status ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="apply-btn" onClick={applyControls} disabled={loading}>
            {loading ? 'Applying...' : 'Apply Changes'}
          </button>

          <button type="button" className="reset-btn" onClick={resetToDefaults} disabled={loading}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Connection Info */}
      {sensorStatus && sensorStatus?.sensorConnection?.lastFailureTime && (
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
