import { Request, Response } from 'express';
import { ValidationError } from 'joi';
import mongoose from 'mongoose';
import { logger } from '../logger';
import { ErrorResponse } from '../models/errorResponse';
import { User } from '../models/user';
import { read } from '../persistence/userPersistence';
import { UserDocument } from '../persistence/userSchema';
import { createJwt } from '../utils/jwt';

/** This route is for registering new users */
export default async (req: Request, res: Response) => {
    logger.debug(`Entered route ${req.path}`);
    logger.info('Login endpoint called');
    try {
        logger.debug('Validating user against schema');
        //TODO - Validation step here
    } catch (err) {
        logger.error('Errors found in request body');
        const error = err as ValidationError;
        res.status(400).send(
            new ErrorResponse(
                400,
                'Invalid user receieved',
                error.details[0].message
            )
        );
        return;
    }

    const emailAddress = req.body.emailAddress;
    logger.debug(`Looking for user with email ${emailAddress}`);
    let user: UserDocument | null;

    try {
        logger.debug('Attempting to search for user');
        user = await read(emailAddress);
        logger.info('User found');
    } catch (err) {
        logger.error('Error encountered when attempting to find user');
        const error = err as mongoose.Error;
        res.status(500).send(
            new ErrorResponse(500, 'Internal server error', error.message)
        );
        logger.debug(error.stack);
        return;
    }

    // If there is no user found with that email address, return a 401
    if (!user) {
        res.status(401).send(
            new ErrorResponse(
                401,
                'Unauthorized',
                'Provided invalid credentials'
            )
        );
        return;
    }

    logger.debug('Ensuring password is correct');
    const isMatch = await user.comparePassword(req.body.password);

    if (isMatch) {
        logger.info('Password matched');
        logger.debug('Generating JWT To return to client');
        const token = createJwt(new User(user));
        logger.debug(`Created JWT ${token}`);

        res.status(200).send({ token });
    } else {
        res.status(401).send(
            new ErrorResponse(
                401,
                'Unauthorized',
                'Provided invalid credentials'
            )
        );
    }
};
