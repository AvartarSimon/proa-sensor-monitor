
import dotenv from 'dotenv';

dotenv.config();

// Configuration interface
export interface Config {
    readonly modbusHost: string;
    readonly modbusPort: number;
    readonly databaseUrl: string;
    readonly pollingInterval: number;
    readonly apiPort: number;
}
// Pure function to create configuration
export const createConfig = (): Config => ({
    modbusHost: process.env.MODBUS_SENSOR_HOST || 'modbus-sensor-simulator',
    modbusPort: parseInt(process.env.MODBUS_SENSOR_PORT || '5020', 10),
    databaseUrl: process.env.DATABASE_URL || 'postgres://user:pass@postgres:5432/sensordb',
    pollingInterval: parseInt(process.env.POLLING_INTERVAL || '1000', 10),
    apiPort: 4001
});