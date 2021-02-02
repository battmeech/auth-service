/** A new user which will be sent via a "register page" */
export type NewUser = {
    firstName: string;
    surname: string;
    password: string;
    emailAddress: string;
};

export type IUser = Omit<NewUser, 'password'> & {
    memberSince: Date;
};

/** The user object that will be returned to the client */
export class User implements IUser {
    firstName: string;
    surname: string;
    emailAddress: string;
    memberSince: Date;

    constructor(user: IUser) {
        this.firstName = user.firstName;
        this.surname = user.surname;
        this.emailAddress = user.emailAddress;
        this.memberSince = user.memberSince;
    }
}
