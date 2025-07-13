import { Router } from 'express';
import { SensorController } from '../controllers/sensorController';

export const createSensorRoutes = (sensorController: SensorController): Router => {
    const router = Router();

    // GET /sensor/status - Get sensor connection status
    router.get('/status', sensorController.getSensorStatus);

    // POST /sensor/control - Control sensor parameters
    router.post('/control', sensorController.controlSensor);

    return router;
}; 