import { Knex } from 'knex';
import { Page, PageRequest, User, UserUpdate } from 'web-shop-shared';
import { EmailAlreadyExistsError } from './auth';
import { toUser } from '../mappers/user';

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
    public constructor(private readonly db: Knex) {}

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

        const rowsAffected = await this.db('users')
            .update({
                email: user.email,
                name: user.name,
                first_name: user.firstName,
            })
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

    /**
     * Search users.
     * @param query - Search query.
     * @param page - Page request.
     * @returns Page of users.
     */
    public async searchUsers(
        query?: string,
        page?: PageRequest,
    ): Promise<Page<User>> {
        const searchQuery = (builder: Knex.QueryBuilder) => {
            if (query) {
                query = `%${query}%`;

                builder
                    .where('users.email', 'like', query)
                    .orWhere('users.name', 'like', query)
                    .orWhere('users.first_name', 'like', query);
            }
        };

        const count = await this.db('users')
            .where(searchQuery)
            .count({
                count: 'users.id',
            })
            .first();

        if (!count?.count) {
            return {
                total: 0,
                data: [],
                page: page?.page ?? 1,
                pageSize: page?.pageSize ?? 20,
            };
        }

        const pageQuery = (builder: Knex.QueryBuilder) => {
            if (page?.page) builder.limit(page.pageSize);

            if (page?.page && page.pageSize)
                builder.offset((page.page - 1) * page.pageSize);
        };

        const users = await this.db('users')
            .modify(pageQuery)
            .where(searchQuery);

        return {
            total: count.count,
            data: users.map(toUser),
            page: page?.page ?? 1,
            pageSize: page?.pageSize ?? 20,
        };
    }
}
