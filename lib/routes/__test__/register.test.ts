import { Request, Response } from 'express';
import { ValidationError } from 'joi';
import { ErrorResponse } from '../../models/errorResponse';
import { NewUser, User } from '../../models/user';
import * as Persistence from '../../persistence/userPersistence';
import { PersistedUser } from '../../persistence/userSchema';
import register from '../register';

describe('Unit: Register User', () => {
    // Mock response
    const response = {} as Response;
    const statusMock = jest.fn().mockReturnValue(response);
    const sendMock = jest.fn().mockReturnValue(response);
    response.status = statusMock;
    response.send = sendMock;

    // New user to test
    const body: NewUser = {
        firstName: 'Joe',
        secondName: 'Bloggs',
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
    } as PersistedUser;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Successfully runs through the create route', async () => {
        // Setup
        const expectedResponseBody: User = new User(expectedBody);

        // Mocks
        const persistenceMock = jest
            .spyOn(Persistence, 'create')
            .mockReturnValue(Promise.resolve(expectedBody));

        const dateMock = jest.spyOn(Date, 'now').mockReturnValueOnce(1);

        // Run test
        await register(request, response);

        // Verify mocks
        expect(persistenceMock).toHaveBeenCalledTimes(1);
        expect(persistenceMock).toHaveBeenCalledWith(body, memberSince);
        expect(statusMock).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(sendMock).toHaveBeenCalledTimes(1);
        expect(sendMock).toHaveBeenCalledWith(expectedResponseBody);
        expect(dateMock).toHaveBeenCalledTimes(1);
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
