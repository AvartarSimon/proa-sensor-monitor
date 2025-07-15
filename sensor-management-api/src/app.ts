import express from 'express';
import bodyParser from 'body-parser';
import { getPrismaClient } from './config/prisma';
import { getAppConfig } from './config/app';
import { corsMiddleware } from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { TemperatureRepository } from './repositories/temperatureRepository';
import { TemperatureService } from './services/temperatureService';
import { SensorService } from './services/sensorService';
import { TemperatureController } from './controllers/temperatureController';
import { SensorController } from './controllers/sensorController';
import { createTemperatureRoutes } from './routes/temperatureRoutes';
import { createSensorRoutes } from './routes/sensorRoutes';
import { HttpClient } from './utils/httpClient';

export class App {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = getAppConfig().port;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.app.use(bodyParser.json());
    this.app.use(corsMiddleware);
  }

  private initializeRoutes(): void {
    const prisma = getPrismaClient();
    const httpClient = new HttpClient(getAppConfig().modbusSensorControlUrl);

    const temperatureRepository = new TemperatureRepository(prisma);
    const temperatureService = new TemperatureService(temperatureRepository);
    const sensorService = new SensorService(httpClient);

    const temperatureController = new TemperatureController(temperatureService);
    const sensorController = new SensorController(sensorService);

    const temperatureRoutes = createTemperatureRoutes(temperatureController);
    const sensorRoutes = createSensorRoutes(sensorController);

    this.app.use('/api/temperatures', temperatureRoutes);
    this.app.use('/sensor', sensorRoutes);

    this.app.get('/health', (_req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          sensorControl: 'connected',
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        console.log(`Backend API running on port ${this.port}`);
        resolve();
      });
    });
  }
}

export const createApp = (): App => {
  return new App();
};
