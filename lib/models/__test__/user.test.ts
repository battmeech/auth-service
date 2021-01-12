import { IUser, User } from '../user';

describe('Unit: User Model', () => {
    it('Successfully instantiates a new user model', () => {
        // Setup
        const memberSince = new Date(Date.now());

        const iUser: IUser = {
            emailAddress: 'joebloggs@email.com',
            firstName: 'Joe',
            secondName: 'Bloggs',
            id: '12',
            memberSince,
        };

        // Run test
        const user = new User(iUser);

        // Assert
        expect(user.emailAddress).toStrictEqual('joebloggs@email.com');
        expect(user.firstName).toStrictEqual('Joe');
        expect(user.secondName).toStrictEqual('Bloggs');
        expect(user.id).toStrictEqual('12');
        expect(user.memberSince).toStrictEqual(memberSince);
    });
});
