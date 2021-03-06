import { Request, Response } from 'express';
import { ErrorResponse } from '../../models/errorResponse';
import { NewUser, User } from '../../models/user';
import * as Persistence from '../../persistence/userPersistence';
import * as JWT from '../../utils/jwt';
import { UserDocument } from '../../persistence/userSchema';
import register from '../register';
import { Config } from '../../config';

describe('Unit: Register User', () => {
    // Mock response
    const response = {} as Response;
    const statusMock = jest.fn().mockReturnValue(response);
    const sendMock = jest.fn().mockReturnValue(response);
    const cookieMock = jest.fn().mockReturnValue(response);
    response.status = statusMock;
    response.send = sendMock;
    response.cookie = cookieMock;

    // New user to test
    const body: NewUser = {
        firstName: 'Joe',
        surname: 'Bloggs',
        emailAddress: 'joebloggs@email.com',
        password: 'J0eblo99sRu1ez',
    };

    // Express.js request object
    const request = {
        path: '/recipe',
        method: 'POST',
        body,
    } as Request;

    // Mock persisted body
    const memberSince = new Date(1);
    const expectedBody = {
        ...body,
        memberSince,
    } as UserDocument;

    const token = 'jwt.token.example';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Successfully runs through the create route', async () => {
        // Setup
        const expectedResponseBody = { token };
        const userObject: User = new User(expectedBody);

        // Mocks
        const persistenceMock = jest
            .spyOn(Persistence, 'create')
            .mockReturnValue(Promise.resolve(expectedBody));

        const dateMock = jest.spyOn(Date, 'now').mockReturnValueOnce(1);

        const jwtMock = jest.spyOn(JWT, 'createJwt').mockReturnValueOnce(token);

        // Run test
        await register(request, response);

        // Verify mocks
        expect(persistenceMock).toHaveBeenCalledTimes(1);
        expect(persistenceMock).toHaveBeenCalledWith(body, memberSince);
        expect(statusMock).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(sendMock).toHaveBeenCalledTimes(1);
        expect(sendMock).toHaveBeenCalledWith(expectedResponseBody);
        expect(cookieMock).toHaveBeenCalledTimes(1);
        expect(cookieMock).toHaveBeenCalledWith('mb-auth', token, {
            httpOnly: true,
            maxAge: Number(Config.jwtExpiry) * 1000,
        });
        expect(dateMock).toHaveBeenCalledTimes(1);
        expect(jwtMock).toHaveBeenCalledTimes(1);
        expect(jwtMock).toHaveBeenCalledWith(userObject);
    });

    it('Returns a 500 when the database save fails', async () => {
        // Setup
        const expectedResponseBody = new ErrorResponse(
            500,
            'Internal server error',
            'Test error'
        );

        // Mocks
        const persistenceMock = jest
            .spyOn(Persistence, 'create')
            .mockImplementationOnce(() => {
                throw new Error('Test error');
            });

        const dateMock = jest.spyOn(Date, 'now').mockReturnValueOnce(1);

        // Run test
        await register(request, response);

        // Verify mocks
        expect(persistenceMock).toHaveBeenCalledTimes(1);
        expect(persistenceMock).toHaveBeenCalledWith(body, memberSince);
        expect(statusMock).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(sendMock).toHaveBeenCalledTimes(1);
        expect(sendMock).toHaveBeenCalledWith(expectedResponseBody);
        expect(dateMock).toHaveBeenCalledTimes(1);
    });
});
