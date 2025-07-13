import { Request, Response, NextFunction } from 'express';
import { isDevelopment } from '../config/app';

export class CustomError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorHandler = (
    error: CustomError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    console.error('Error occurred:', {
        message: error.message,
        stack: isDevelopment() ? error.stack : undefined,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(isDevelopment() && { stack: error.stack })
    });
};

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
}; 