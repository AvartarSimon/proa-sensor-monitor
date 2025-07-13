import { Request, Response, NextFunction } from 'express';
import { SensorService } from '../services/sensorService';
import { CustomError } from '../middleware/errorHandler';

export class SensorController {
    constructor(private sensorService: SensorService) { }

    getSensorStatus = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const status = await this.sensorService.getSensorStatus();
            res.json(status);
        } catch (error) {
            next(new CustomError(
                error instanceof Error ? error.message : 'Failed to get sensor status',
                500
            ));
        }
    };

    controlSensor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.sensorService.controlSensor(req.body);
            res.json(result);
        } catch (error) {
            next(new CustomError(
                error instanceof Error ? error.message : 'Failed to control sensor',
                500
            ));
        }
    };
} 