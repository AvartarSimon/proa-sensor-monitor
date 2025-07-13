import { Request, Response } from 'express';
import { SensorService } from '../../shared/services/sensor-service';

// Connection state tracking
let connectionState = {
    isConnected: true,
    lastFailureTime: null as Date | null,
    lastFailureMessage: null as string | null
};

export class SensorController {
    constructor(private sensorService: SensorService) { }

    // Control sensor parameters
    async controlSensor(req: Request, res: Response): Promise<void> {
        try {
            const { period, amplitude, status } = req.body;
            await this.sensorService.controlSensor({ period, amplitude, status });
            res.json({ success: true, message: 'Control commands sent successfully' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: errorMessage });
        }
    }
    // Get sensor status with connection health
    async getSensorStatus(req: Request, res: Response): Promise<void> {
        try {
            const status = await this.sensorService.getSensorStatus();

            // Update connection state (successful read)
            connectionState = {
                isConnected: true,
                lastFailureTime: connectionState.lastFailureTime,
                lastFailureMessage: connectionState.lastFailureMessage
            };

            // Enhanced status response
            const enhancedStatus = {
                // Sensor data
                period: status.period,
                amplitude: status.amplitude,
                running: status.running,
                baseTemperature: status.baseTemperature,
                timestamp: status.timestamp.toISOString(),
                // Connection health
                sensorConnection: {
                    isConnected: connectionState.isConnected,
                    lastFailureTime: connectionState.lastFailureTime?.toISOString() || null,
                    lastFailureMessage: connectionState.lastFailureMessage
                }
            };

            res.json(enhancedStatus);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // Update connection state (failed read)
            connectionState = {
                isConnected: false,
                lastFailureTime: new Date(),
                lastFailureMessage: errorMessage
            };
            res.status(500).json({
                error: errorMessage,
                sensorConnection: {
                    isConnected: connectionState.isConnected,
                    lastFailureTime: connectionState.lastFailureTime?.toISOString() || null,
                    lastFailureMessage: connectionState.lastFailureMessage
                }
            });
        }
    }
} 