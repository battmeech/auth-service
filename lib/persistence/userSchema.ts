import bcrypt from 'bcryptjs';
import mongoose, { Document, Model } from 'mongoose';
import { IUser, NewUser } from '../models/user';

export type UserDocument = Document &
    IUser &
    Pick<NewUser, 'password'> & {
        comparePassword(candidatePassword: string): Promise<boolean>;
    };

export type UserModel = Model<UserDocument>;

const UserSchema = new mongoose.Schema<UserDocument, UserModel>({
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    memberSince: { type: Date, required: true },
});

UserSchema.pre<UserDocument>('save', async function (next) {
    const user = this;

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
    const user = this as UserDocument;
    const isMatch = await bcrypt.compare(candidatePassword, user.password);
    return isMatch;
};

export const UserModel = mongoose.model<UserDocument, UserModel>(
    'User',
    UserSchema
);
