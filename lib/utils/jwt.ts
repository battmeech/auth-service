import { fstat } from 'fs';
import jwt from 'jsonwebtoken';
import { Config } from '../config';
import { User } from '../models/user';
import fs from 'fs';
import { logger } from '../logger';

const file = fs.readFileSync('test.key');

/**
 * Create a JSON web token for the user
 * @param user the payload to be included in the JWT
 */
export function createJwt(user: User) {
    logger.info(Config.jwtExpiry);
    const options: jwt.SignOptions = {
        expiresIn: Number(Config.jwtExpiry),
        subject: user.emailAddress,
        algorithm: 'RS256',
        issuer: 'MBeech Auth',
    };

    const token = jwt.sign({ user }, file, options);

    return token;
}
