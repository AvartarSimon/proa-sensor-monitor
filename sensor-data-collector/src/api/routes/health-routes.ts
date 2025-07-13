import { Router } from 'express';
import { HealthController } from '../controllers/health-controller';

// Pure function to create health routes
export const createHealthRoutes = (healthController: HealthController): Router => {
    const router = Router();

    // Health check endpoint
    router.get('/health', (req, res) => healthController.getHealth(req, res));

    return router;
}; 