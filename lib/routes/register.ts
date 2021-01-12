import { Request, Response } from 'express';
import { ValidationError } from 'joi';
import mongoose from 'mongoose';
import { logger } from '../logger';
import { ErrorResponse } from '../models/errorResponse';
import { User } from '../models/user';
import { create } from '../persistence/userPersistence';
import { PersistedUser } from '../persistence/userSchema';

/** This route is for registering new users */
export default async (req: Request, res: Response) => {
    logger.debug(`Entered route ${req.path}`);
    logger.info('Create user endpoint called');
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

    let persistedUser: PersistedUser;
    const memberSince = new Date(Date.now());
    try {
        logger.debug('Attempting to save new user');
        persistedUser = await create(req.body, memberSince);
    } catch (err) {
        logger.error('Error encountered when attempting to save user');
        const error = err as mongoose.Error;
        res.status(500).send(
            new ErrorResponse(500, 'Internal server error', error.message)
        );
        logger.debug(error.stack);
        return;
    }

    logger.debug(
        `User successfully saved id: ${persistedUser._id}, returning response to client`
    );
    logger.info('New user saved');

    res.status(200).send(new User(persistedUser));
};
