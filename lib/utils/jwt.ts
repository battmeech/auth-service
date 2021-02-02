import jwt from 'jsonwebtoken';
import { Config } from '../config';
import { JWT } from '../models/jwt';
import { User } from '../models/user';

const options = (emailAddress: string): jwt.SignOptions => ({
    expiresIn: Number(Config.jwtExpiry),
    subject: emailAddress,
    algorithm: 'RS256',
    issuer: 'MBeech Auth',
});

/**
 * Create a JSON web token for the user
 * @param user the payload to be included in the JWT
 */
export function createJwt(user: User) {
    const token = jwt.sign({ user }, Config.jwtKey, options(user.emailAddress));
    return token;
}

/**
 * Verify a JWT and create a JWT object
 * @param jwtString the JWT to verify
 */
export function verifyJwt(jwtString: string) {
    const jwtToken = jwt.verify(jwtString, Config.publicKey) as JWT;
    return jwtToken;
}
