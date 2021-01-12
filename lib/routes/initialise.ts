import { Express } from 'express';
import { logger } from '../logger';
import register from './register';

export function initialiseRoutes(app: Express) {
    logger.info('Initialising routes');

    app.post('/register', register);

    logger.info('Routes initialised successfully');
}
