import dotenv from 'dotenv';

dotenv.config();

export const getAppConfig = () => ({
    port: parseInt(process.env['PORT'] || '4000'),
    nodeEnv: process.env['NODE_ENV'] || 'development',
    corsOrigin: process.env['CORS_ORIGIN'] || '*',
    modbusSensorControlUrl: process.env['MODBUS_SENSOR_CONTROL_URL'] || 'http://sensor-data-collector:4001'
});

export const isDevelopment = (): boolean => getAppConfig().nodeEnv === 'development';
export const isProduction = (): boolean => getAppConfig().nodeEnv === 'production'; 