import fs from 'fs';
import jwt from 'jsonwebtoken';
import { Config } from '../config';
import { JWT } from '../models/jwt';
import { User } from '../models/user';

const privateKey = fs.readFileSync('test.key');
const publicKey = fs.readFileSync('test.key.pub');

/**
 * Create a JSON web token for the user
 * @param user the payload to be included in the JWT
 */
export function createJwt(user: User) {
    const options: jwt.SignOptions = {
        expiresIn: Number(Config.jwtExpiry),
        subject: user.emailAddress,
        algorithm: 'RS256',
        issuer: 'MBeech Auth',
    };

    const token = jwt.sign({ user }, privateKey, options);

    return token;
}

export function verifyJwt(jwtString: string) {
    const jwtToken = jwt.verify(jwtString, publicKey) as JWT;
    return jwtToken;
}
