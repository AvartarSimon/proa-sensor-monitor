import { Pool } from 'pg';

export interface SensorReading {
    id?: number;
    temperature: number;
    timestamp: Date;
}

export class SensorReadingsRepository {
    private readonly defaultSensorId = process.env.DEFAULT_SENSOR_ID || '550e8400-e29b-41d4-a716-446655440000';
    private initialized = false;

    constructor(private pool: Pool) { }

    // Initialize sensors at startup (call this once when service starts)
    async initializeDefaultSensorInDB(): Promise<void> {
        if (this.initialized) {
            return; // Already initialized
        }

        const client = await this.pool.connect();
        try {
            const query = {
                text: `
                INSERT INTO sensors (id, name, description) 
                VALUES ($1, $2, $3) 
                ON CONFLICT (id) DO NOTHING
            `,
                values: [
                    this.defaultSensorId,
                    'Temperature Sensor 1',
                    'Simulated Modbus temperature sensor'
                ]
            };

            await client.query(query);
            this.initialized = true;
            console.log('Sensors initialized successfully');
        } catch (error) {
            console.error('Error initializing sensors:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async storeReading(temperature: number): Promise<void> {
        const timestamp = new Date();
        const sensorId = this.defaultSensorId;
        const client = await this.pool.connect();
        try {
            await client.query(
                'INSERT INTO sensor_readings (temperature_celsius, timestamp, sensor_id) VALUES ($1, $2, $3)',
                [temperature, timestamp, sensorId]
            );
        } finally {
            client.release();
        }
    }

    async getRecentReadings(limit: number = 100): Promise<SensorReading[]> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(
                'SELECT id, temperature_celsius, timestamp FROM sensor_readings ORDER BY timestamp DESC LIMIT $1',
                [limit]
            );
            return result.rows.map(row => ({
                id: row.id,
                temperature: parseFloat(row.temperature_celsius),
                timestamp: new Date(row.timestamp)
            }));
        } finally {
            client.release();
        }
    }
}

// Factory function to create sensor readings repository
export const createSensorReadingsRepository = (pool: Pool): SensorReadingsRepository => {
    return new SensorReadingsRepository(pool);
}; 