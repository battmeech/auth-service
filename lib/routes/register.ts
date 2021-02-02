import { Request, Response } from 'express';
import { ValidationError } from 'joi';
import mongoose from 'mongoose';
import { Config } from '../config';
import { logger } from '../logger';
import { ErrorResponse } from '../models/errorResponse';
import { User } from '../models/user';
import { create } from '../persistence/userPersistence';
import { UserDocument } from '../persistence/userSchema';
import { createJwt } from '../utils/jwt';

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

    let persistedUser: UserDocument;
    const memberSince = new Date(Date.now());
    try {
        logger.debug('Attempting to save new user');
        persistedUser = await create(req.body, memberSince);
    } catch (err) {
        logger.error('Error encountered when attempting to save user');
        const error = err as mongoose.Error;

        /** Error code 11000 represents "duplicate entry" */
        if (err.code === 11000) {
            res.status(400).send(
                new ErrorResponse(
                    400,
                    'Bad request',
                    'A user with that email address already exists'
                )
            );
            return;
        }
        res.status(500).send(
            new ErrorResponse(500, 'Internal server error', error.message)
        );
        logger.debug(error.stack);
        return;
    }

    logger.debug(`User successfully saved id: ${persistedUser._id}`);
    logger.info('New user saved');

    logger.debug('Generating JWT To return to client');
    const token = createJwt(new User(persistedUser));
    logger.debug(`Created JWT ${token}`);

    const domain = req.query?.referrer as string | undefined;

    res.cookie('mb-auth', token, {
        maxAge: Number(Config.jwtExpiry) * 1000,
        httpOnly: true,
        domain,
    });

    res.status(200).send({ token });
};
