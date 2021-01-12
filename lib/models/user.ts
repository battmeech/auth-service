/** A new user which will be sent via a "register page" */
export type NewUser = {
    firstName: string;
    secondName: string;
    password: string;
    emailAddress: string;
};

export type IUser = {
    id: string;
    firstName: string;
    secondName: string;
    emailAddress: string;
    memberSince: Date;
};

/** The user object that will be returned to the client */
export class User implements IUser {
    id: string;
    firstName: string;
    secondName: string;
    emailAddress: string;
    memberSince: Date;

    constructor(user: IUser) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.secondName = user.secondName;
        this.emailAddress = user.emailAddress;
        this.memberSince = user.memberSince;
    }
}
