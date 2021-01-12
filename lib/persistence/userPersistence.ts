import { NewUser } from '../models/user';
import { PersistedUser, UserModel } from './userSchema';

/**
 * Save a user to MongoDB
 * @param newUser the User to be saved
 */
export async function create(
    newUser: NewUser,
    memberSince: Date
): Promise<PersistedUser> {
    const userToSave = new UserModel({
        ...newUser,
        memberSince,
    });

    const savedUser = await userToSave.save();

    return savedUser;
}

/**
 * Find a user via their email address
 * @param emailAddress the email address to look for
 */
export async function read(
    emailAddress: string
): Promise<PersistedUser | null> {
    const foundUser = await UserModel.findOne({ emailAddress });

    return foundUser;
}
