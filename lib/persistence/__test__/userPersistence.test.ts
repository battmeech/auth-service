import { NewUser } from '../../models/user';
import { create, read } from '../userPersistence';
import { UserModel } from '../userSchema';

describe('Unit: User Persistence', () => {
    it('Saves a valid user', async () => {
        // Setup
        const input: NewUser = {
            firstName: 'Joe',
            secondName: 'Bloggs',
            emailAddress: 'joebloggs@email.com',
            password: 'J0eblo99sRu1ez',
        };
        const memberSince = new Date(Date.now());

        const expected = { ...input, memberSince };

        // Mocks
        const persistenceMock = jest
            .spyOn(UserModel.prototype, 'save')
            .mockReturnValueOnce(expected);

        // Run test
        const actual = await create(input, memberSince);

        // Assert
        expect(actual).toStrictEqual(expected);

        // Verify mocks
        expect(persistenceMock).toHaveBeenCalledTimes(1);
    });

    it('Successfully reads a user', async () => {
        // Setup
        const expected = {
            firstName: 'Joe',
            secondName: 'Bloggs',
            emailAddress: 'joebloggs@email.com',
        } as any;

        const emailAddress = '12';

        // Mocks
        const persistenceMock = jest
            .spyOn(UserModel, 'findOne')
            .mockResolvedValue(expected);

        // Run test
        const actual = await read(emailAddress);

        // Assert
        expect(actual).toStrictEqual(expected);

        // Verify mocks
        expect(persistenceMock).toHaveBeenCalledTimes(1);
        expect(persistenceMock).toHaveBeenCalledWith({ emailAddress });
    });
});
