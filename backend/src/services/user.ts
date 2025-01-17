import { Knex } from 'knex';
import { User, UserUpdate } from 'shared';
import { EmailAlreadyExistsError } from './auth';
import { toUser } from '../mappers/user';
import { UserRow } from '../database/rows';

/**
 * Error thrown when user not found.
 * @extends Error
 */
export class UserNotFoundError extends Error {
    public constructor() {
        super('User not found');
    }
}

/**
 * Service for managing users.
 */
export default class UserService {
    /**
     * Creates an instance of UserService.
     * @param db - Knex instance.
     * @returns UserService instance.
     */
    public constructor(private readonly db: Knex) { }

    /**
     * Get user by id.
     * @param id - User id.
     * @returns User.
     * @throws UserNotFoundError if user is not found.
     */
    public async getUser(id: number): Promise<User> {
        const row = await this.db('users').select('*').where({ id }).first();
        if (!row) {
            throw new UserNotFoundError();
        }

        return toUser(row);
    }

    /**
     * Delete user by id.
     * @param id - User id.
     * @throws UserNotFoundError if user is not found.
     */
    public async deleteUser(id: number): Promise<void> {
        const rowsAffected = await this.db('users').delete().where({ id });
        if (rowsAffected === 0) {
            throw new UserNotFoundError();
        }
    }

    /**
     * Update user.
     * @param id - User id.
     * @param user - User data.
     * @throws EmailAlreadyExistsError if email is already taken.
     * @throws UserNotFoundError if user is not found.
     */
    public async updateUser(id: number, user: UserUpdate): Promise<void> {
        if (user.email) {
            const emailTaken = await this.isUserEmailTaken(user.email, id);
            if (emailTaken) {
                throw new EmailAlreadyExistsError();
            }
        }

        let update: Partial<UserRow> = {};
        if (user.email) {
            update.email = user.email;
        } if (user.pushToken) {
            update.push_token = user.pushToken;
        }

        if (Object.keys(update).length === 0) {
            return;
        }

        const rowsAffected = await this.db('users')
            .update(update)
            .where({ id });

        if (rowsAffected === 0) {
            throw new UserNotFoundError();
        }
    }

    /**
     * Check if user email is taken.
     * @param email - User email.
     * @param userId - User id.
     * @returns True if email is taken, false otherwise.
     */
    public async isUserEmailTaken(
        email: string,
        userId?: number,
    ): Promise<boolean> {
        const user = await this.db('users')
            .select('id')
            .where({ email })
            .first();
        return !!user && user.id !== userId;
    }
}
