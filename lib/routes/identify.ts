import { Request, Response } from 'express';
import { logger } from '../logger';
import { ErrorResponse } from '../models/errorResponse';
import { User } from '../models/user';
import { read } from '../persistence/userPersistence';
import { verifyJwt } from '../utils/jwt';

export default async (req: Request, res: Response) => {
    logger.debug(`Entered route ${req.path}`);
    logger.info('Identify user endpoint called');

    logger.debug('Extracting the "authorization" header');
    const token = req.headers.authorization?.replace(/Bearer\s+/, '');

    if (!token) {
        logger.error('No token was found in the Authorization header');
        res.status(401).send(
            new ErrorResponse(
                401,
                'Unauthorized',
                'No authorization header was provided'
            )
        );
        return;
    }

    logger.debug(`Extracted token from header: ${token}`);
    logger.debug('Verifying token');
    const jwtToken = verifyJwt(token);
    logger.debug(`Verified token ${JSON.stringify(jwtToken)}`);

    const emailAddress = jwtToken.user.emailAddress;
    logger.debug(`Looking for user with email ${emailAddress}`);
    const user = await read(emailAddress);
    if (user) {
        logger.debug('Found user, returning to user');
        logger.info('User found');
        res.status(200).send(new User(user));
    } else {
        res.status(404).send(
            new ErrorResponse(
                404,
                'Resource not found',
                'Could not find user details'
            )
        );
    }
};
