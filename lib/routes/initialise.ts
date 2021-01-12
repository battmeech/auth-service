import { Express } from 'express';
import { logger } from '../logger';
import identify from './identify';
import register from './register';

export function initialiseRoutes(app: Express) {
    logger.info('Initialising routes');

    app.post('/register', register);

    app.get('/identify', identify);

    logger.info('Routes initialised successfully');
}
