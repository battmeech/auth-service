import bcrypt from 'bcryptjs';
import mongoose, { Document } from 'mongoose';
import { IUser, NewUser } from '../models/User';

export type PersistedUser = Document & IUser & Pick<NewUser, 'password'>;

const UserSchema = new mongoose.Schema({
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    secondName: { type: String, required: true },
    memberSince: { type: Date, required: true },
});

UserSchema.pre('save', async function (next) {
    const user = this as PersistedUser;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    const salt = await bcrypt.genSalt(10);

    // hash the password using our new salt
    const hash = await bcrypt.hash(user.password, salt);

    // override the cleartext password with the hashed one
    user.password = hash;
    next();
});

UserSchema.methods.comparePassword = async function (
    candidatePassword: string
) {
    const user = this as PersistedUser;
    const isMatch = await bcrypt.compare(candidatePassword, user.password);
    return isMatch;
};

export const UserModel = mongoose.model<PersistedUser>('User', UserSchema);
