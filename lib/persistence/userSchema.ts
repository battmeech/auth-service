import mongoose, { Document } from 'mongoose';
import { IUser, NewUser } from '../models/User';

export type PersistedUser = Document & IUser & Pick<NewUser, 'password'>;

const UserSchema = new mongoose.Schema({
    emailAddress: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    secondName: { type: String, required: true },
    memberSince: { type: Date, required: true },
});

export const UserModel = mongoose.model<PersistedUser>('User', UserSchema);
