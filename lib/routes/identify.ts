import { Request, Response } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { logger } from '../logger';
import { ErrorResponse } from '../models/errorResponse';
import { JWT } from '../models/jwt';
import { User } from '../models/user';
import { read } from '../persistence/userPersistence';

const file = fs.readFileSync('test.key.pub');

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
    const jwtToken = jwt.verify(token, file) as JWT;
    logger.info(jwtToken.exp);
    logger.info(new Date(jwtToken.exp));
    logger.info(`Verified token ${JSON.stringify(jwtToken)}`);
    if (new Date(jwtToken.exp) < new Date(Date.now())) {
        res.status(401).send(
            new ErrorResponse(401, 'Unauthorized', 'Token has expired')
        );
        return;
    }

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
