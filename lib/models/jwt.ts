import { IUser } from './user';

export type JWT = {
    exp: number;
    data: IUser;
    iat: number;
};
