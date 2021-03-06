import { Config } from '../../config';
import { User } from '../../models/user';
import { createJwt } from '../jwt';
import jwt from 'jsonwebtoken';

describe('Unit: JWT Utils', () => {
    it('Saves a valid user', async () => {
        // Setup
        Config.jwtKey = 'this is my key';

        process.env.JWT_KEY = '1234';
        const memberSince = new Date(Date.now());
        const user: User = new User({
            firstName: 'Joe',
            surname: 'Bloggs',
            emailAddress: 'joebloggs@email.com',
            memberSince,
        });

        const options = {
            algorithm: 'RS256',
            expiresIn: 86400,
            issuer: 'MBeech Auth',
            subject: 'joebloggs@email.com',
        };

        const expected: any = 'bob';

        // Setup mocks
        const jwtMock = jest.spyOn(jwt, 'sign').mockReturnValue(expected);

        // Run test
        const actual = createJwt(user);

        // Assert
        expect(actual).toStrictEqual(expected);

        // Verify mocks
        expect(jwtMock).toHaveBeenCalledTimes(1);
        expect(jwtMock).toHaveBeenLastCalledWith(
            { user },
            Config.jwtKey,
            options
        );
    });
});
