import { Router } from 'express';
import { SensorController } from '../controllers/sensor-controller';

// Pure function to create sensor routes
export const createSensorRoutes = (sensorController: SensorController): Router => {
    const router = Router();

    // Control sensor endpoint
    router.post('/control', (req, res) => sensorController.controlSensor(req, res));

    // Get sensor status endpoint
    router.get('/status', (req, res) => sensorController.getSensorStatus(req, res));

    return router;
}; 