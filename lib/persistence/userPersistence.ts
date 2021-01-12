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
