import { Request, Response } from 'express';
import { NewUser } from '../../models/user';
import { PersistedUser } from '../../persistence/userSchema';

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
        surname: 'Bloggs',
        emailAddress: 'joebloggs@email.com',
        password: 'J0eblo99sRu1ez',
    };

    // Express.js request object
    const request = {
        path: '/identify',
        method: 'GET',
        headers: { authorization: 'Bearer 12' },
    } as Request;

    // Mock persisted body
    const memberSince = new Date(1);
    const expectedBody = {
        ...body,
        memberSince,
    } as PersistedUser;

    const token = 'jwt.token.example';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Successfully runs through the identify route', async () => {});
});
