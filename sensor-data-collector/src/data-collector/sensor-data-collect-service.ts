import { SensorReadingsRepository } from '../shared/database/sensor-readings-repository';
import { SensorService } from '../shared/services/sensor-service';

const logSensorData = (data: { temperature: number; timestamp: Date }): void => {
  console.log(`[${data.timestamp.toISOString()}] Temperature: ${data.temperature.toFixed(1)}°C`);
  console.log('-'.repeat(40));
};

export const startDataPollingFromSensor = async (
  sensorService: SensorService,
  sensorReadingsRepository: SensorReadingsRepository,
): Promise<void> => {
  console.log('Starting data collection polling...');

  try {
    const sensorData = await sensorService.readSensorTemperatureData();

    console.log('*******write to db:');
    await sensorReadingsRepository.storeReading(sensorData.temperature);

    logSensorData(sensorData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error collecting data from polling sensor:', errorMessage);
  }
  setTimeout(() => startDataPollingFromSensor(sensorService, sensorReadingsRepository), 1000);
};
