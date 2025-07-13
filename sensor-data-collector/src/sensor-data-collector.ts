import { createApiServer } from './api';
import { startDataPollingFromSensor } from './data-collector/sensor-data-collect-service';
import { createConfig } from './config';
import { createModbusClient, connectToModbusSensor } from './utils/modbus-utils';
import { createDatabasePool } from './shared/database/dbconnection';
import { createSensorReadingsRepository } from './shared/database/sensor-readings-repository';
import { SensorService } from './shared/services/sensor-service';

// Application factory
const createApplication = () => {
    const config = createConfig();
    const modbusClient = createModbusClient();
    const databasePool = createDatabasePool(config);
    const sensorService = new SensorService(modbusClient);
    const sensorReadingsRepository = createSensorReadingsRepository(databasePool);

    const startApiServer = async () => {
        // Initialize database first
        console.log('Initializing database...');
        await sensorReadingsRepository.initializeDefaultSensorInDB();
        const apiServer = createApiServer(config, sensorService);
        apiServer.startServer();
    };

    const startSensorDataPolling = () => {
        startDataPollingFromSensor(sensorService, sensorReadingsRepository);
    };

    const connectToSensor = async () => {
        console.log('Connecting to Modbus sensor...');
        const connected = await connectToModbusSensor(modbusClient, config);
        if (connected) {
            console.log('Successfully connected to Modbus sensor');
        } else {
            console.error('Failed to connect to Modbus sensor');
        }
        return connected;
    };

    return { startApiServer, startSensorDataPolling, connectToSensor };
};

// Start the application
const startApplication = async (): Promise<void> => {
    const app = createApplication();

    // Connect to sensor
    const connected = await app.connectToSensor();

    if (connected) {
        // Start both services
        await app.startApiServer();
        app.startSensorDataPolling();
    } else {
        console.error('Cannot start services without Modbus connection');
        process.exit(1);
    }
};

startApplication().catch(error => {
    console.error('Failed to start application:', error);
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});
