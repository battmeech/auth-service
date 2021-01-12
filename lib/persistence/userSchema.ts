import mongoose, { Document } from 'mongoose';
import { IUser } from '../models/User';

export type PersistedUser = Document & IUser;

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    secondName: { type: String, required: true },
    emailAddress: { type: String, required: true },
    memberSince: { type: Date, required: true },
});

export const UserModel = mongoose.model<PersistedUser>('User', UserSchema);
