import { logger } from '../logger';
import { Request, Response } from 'express';
import { read } from '../persistence/userPersistence';
import { User } from '../models/user';
import { ErrorResponse } from '../models/errorResponse';
import jwt from 'jsonwebtoken';
import { Config } from '../config';
import { JWT } from '../models/jwt';

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
    //TODO extract this somewhere else, and include the date checking
    const jwtToken = jwt.verify(token, Config.jwtKey) as JWT;
    if (new Date(jwtToken.exp) < new Date(Date.now())) {
        res.status(401).send(
            new ErrorResponse(401, 'Unauthorized', 'Token has expired')
        );
        return;
    }
    logger.debug(`Verified token ${jwtToken}`);

    const emailAddress = jwtToken.data.emailAddress;
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
