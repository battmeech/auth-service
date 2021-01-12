import jwt from 'jsonwebtoken';
import { Config } from '../config';
import { User } from '../models/user';

/**
 * Create a JSON web token for the user
 * @param user the payload to be included in the JWT
 */
export function createJwt(user: User) {
    const token = jwt.sign(
        {
            exp: Date.now() + Number(Config.jwtExpiry),
            data: user,
        },
        Config.jwtKey
    );

    return token;
}
