import { useState, useEffect, useCallback } from 'react';
import {
  sensorDataApi,
  type SensorStatus,
  type SensorControlType,
} from '../services/sensorDataApi';

export const useSensorControl = () => {
  const [sensorStatus, setSensorStatus] = useState<SensorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [controlLoading, setControlLoading] = useState(false);

  const fetchSensorStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await sensorDataApi.getSensorStatus();
      setSensorStatus(status);
    } catch (err) {
      console.error('Error fetching sensor status:', err);
      setError('Failed to load sensor status');
    } finally {
      setLoading(false);
    }
  }, []);

  const controlSensor = useCallback(
    async (controls: SensorControlType) => {
      try {
        setControlLoading(true);
        const response = await sensorDataApi.controlSensor(controls);

        if (response.success) {
          // Refresh status after successful control
          await fetchSensorStatus();
          return { success: true, message: response.message };
        } else {
          return { success: false, message: response.message };
        }
      } catch (err) {
        console.error('Error controlling sensor:', err);
        return { success: false, message: 'Failed to control sensor' };
      } finally {
        setControlLoading(false);
      }
    },
    [fetchSensorStatus],
  );

  const toggleSensor = useCallback(async () => {
    if (!sensorStatus) return;

    return await controlSensor({ status: !sensorStatus.running });
  }, [sensorStatus, controlSensor]);

  const updatePeriod = useCallback(
    async (period: number) => {
      return await controlSensor({ period });
    },
    [controlSensor],
  );

  const updateAmplitude = useCallback(
    async (amplitude: number) => {
      return await controlSensor({ amplitude });
    },
    [controlSensor],
  );

  // Auto-refresh status every 5 seconds
  useEffect(() => {
    fetchSensorStatus();

    const interval = setInterval(fetchSensorStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchSensorStatus]);

  return {
    sensorStatus,
    loading,
    error,
    controlLoading,
    fetchSensorStatus,
    controlSensor,
    toggleSensor,
    updatePeriod,
    updateAmplitude,
  };
};
