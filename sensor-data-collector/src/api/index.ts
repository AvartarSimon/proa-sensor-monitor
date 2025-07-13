import express from 'express';
import bodyParser from 'body-parser';
import { type Config } from '../config';
import { createSensorRoutes } from './routes/sensor-routes';
import { createHealthRoutes } from './routes/health-routes';
import { SensorController } from './controllers/sensor-controller';
import { HealthController } from './controllers/health-controller';
import { SensorService } from '../shared/services/sensor-service';

// Pure function to create Express app
const createExpressApp = (config: Config) => {
    const app = express();
    app.use(bodyParser.json());
    return app;
};

// Pure function to setup API routes
const setupApiRoutes = (app: express.Application, sensorController: SensorController, healthController: HealthController) => {
    // Mount sensor routes
    app.use('/sensor', createSensorRoutes(sensorController));

    // Mount health routes
    app.use('/', createHealthRoutes(healthController));
};

// Pure function to create API server
export const createApiServer = (config: Config, sensorService: SensorService) => {
    const app = createExpressApp(config);
    const sensorController = new SensorController(sensorService);
    const healthController = new HealthController();

    setupApiRoutes(app, sensorController, healthController);

    const startServer = () => {
        app.listen(config.apiPort, () => {
            console.log(`Modbus Client API server running on port ${config.apiPort}`);
        });
    };

    return { app, startServer };
}; 