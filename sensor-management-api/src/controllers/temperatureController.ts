import { Request, Response, NextFunction } from 'express';
import { TemperatureService } from '../services/temperatureService';
import { CustomError } from '../middleware/errorHandler';
import { TemperatureQueryParams, StatsQueryParams } from '../services/types';

export class TemperatureController {
  constructor(private temperatureService: TemperatureService) {}

  getTemperatures = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = req.query as TemperatureQueryParams;
      const result = await this.temperatureService.getTemperatureData(params);
      res.json(result);
    } catch (error) {
      next(
        new CustomError(
          error instanceof Error ? error.message : 'Failed to fetch temperature data',
          500,
        ),
      );
    }
  };

  getTemperatureStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = req.query as StatsQueryParams;
      const result = await this.temperatureService.getTemperatureStats(params);
      res.json(result);
    } catch (error) {
      next(
        new CustomError(
          error instanceof Error ? error.message : 'Failed to fetch temperature statistics',
          500,
        ),
      );
    }
  };

  getRecentTemperatures = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const limit = req.query['limit'] ? parseInt(req.query['limit'] as string) : 100;
      const result = await this.temperatureService.getRecentTemperatures(limit);
      res.json(result);
    } catch (error) {
      next(
        new CustomError(
          error instanceof Error ? error.message : 'Failed to fetch recent temperatures',
          500,
        ),
      );
    }
  };
}
