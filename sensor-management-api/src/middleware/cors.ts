import { Request, Response, NextFunction } from 'express';
import { getAppConfig } from '../config/app';

export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const config = getAppConfig();

  res.header('Access-Control-Allow-Origin', config.corsOrigin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};
