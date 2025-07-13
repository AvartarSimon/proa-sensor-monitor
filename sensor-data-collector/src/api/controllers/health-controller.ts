import { Request, Response } from 'express';

export class HealthController {
    // Health check endpoint
    getHealth(req: Request, res: Response): void {
        res.json({
            status: 'healthy',
            service: 'sensor-data-collector-api',
            timestamp: new Date().toISOString()
        });
    }
} 