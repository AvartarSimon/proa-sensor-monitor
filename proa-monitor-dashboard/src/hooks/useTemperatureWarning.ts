import { useEffect } from 'react';
import { useWarning } from '../utils/useWarning';
import type { TemperatureStats } from '../services/sensorDataApi';

export const useTemperatureWarning = (stats: TemperatureStats | null) => {
  const { addWarning } = useWarning();

  useEffect(() => {
    if (stats?.stats?.maxTemperature && stats?.stats?.averageTemperature) {
      if (stats.stats.maxTemperature > 40 && stats.stats.averageTemperature < 50) {
        addWarning(
          'warning',
          `The maximum temperature is over ${stats.stats.maxTemperature}°C, please note! <br/> Proa AI System has called the owner of the Farm`,
        );
      } else if (stats.stats.maxTemperature > 50) {
        addWarning(
          'error',
          `Warning! The average temperature is over ${stats.stats.maxTemperature}°C, please note <br/> The message has been sent to the owner of the Farm`,
        );
      }
    }
  }, [stats?.stats?.averageTemperature, stats?.stats?.maxTemperature, addWarning]);
};
