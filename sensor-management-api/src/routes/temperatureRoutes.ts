import { Router } from "express";
import { TemperatureController } from "../controllers/temperatureController";

export const createTemperatureRoutes = (
  temperatureController: TemperatureController,
): Router => {
  const router = Router();

  // GET /api/temperatures - Get temperature data with timescale and aggregation
  router.get("/", temperatureController.getTemperatures);

  // GET /api/temperatures/stats - Get temperature statistics
  router.get("/stats", temperatureController.getTemperatureStats);

  // GET /api/temperatures/recent - Get recent temperature data
  router.get("/recent", temperatureController.getRecentTemperatures);

  return router;
};
