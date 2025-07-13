import express from "express";
import bodyParser from "body-parser";
import { getAppConfig } from "./config/app";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { SensorService } from "./services/sensorService";
import { SensorController } from "./controllers/sensorController";
import { createSensorRoutes } from "./routes/sensorRoutes";
import { HttpClient } from "./utils/httpClient";

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
    const httpClient = new HttpClient(getAppConfig().modbusSensorControlUrl);

    const sensorService = new SensorService(httpClient);
    const sensorController = new SensorController(sensorService);

    const sensorRoutes = createSensorRoutes(sensorController);

    this.app.use("/sensor", sensorRoutes);

    this.app.get("/health", (_req, res) => {
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          database: "connected",
          sensorControl: "connected",
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
