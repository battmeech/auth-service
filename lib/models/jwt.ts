import { IUser } from './user';

export type JWT = {
    user: IUser;
    iat: number;
    exp: number;
    iss: string;
    sub: string;
};
