import { Knex } from 'knex';
import * as argon2 from '@node-rs/argon2';
import * as crypto from 'node:crypto';
import SessionService from './session';
import UserService, { UserNotFoundError } from './user';

/**
 * Error thrown when email already exists.
 * @extends Error
 */
export class EmailAlreadyExistsError extends Error {
    public constructor() {
        super('email already exists');
    }
}

/**
 * Error thrown when invalid username or password.
 * @extends Error
 */
export class InvalidUsernameOrPasswordError extends Error {
    public constructor() {
        super('invalid username or password');
    }
}

/**
 * Error thrown when invalid password.
 * @extends Error
 */
export class InvalidPasswordError extends Error {
    public constructor() {
        super('invalid password');
    }
}

/**
 * Error thrown a password does not match requirements, like a minimal length.
 * @extends Error
 */
export class PasswordRequirementUnmetError extends Error {
    public constructor() {
        super('password does not match requirements');
    }
}

/**
 * Service for managing authentication.
 */
export default class AuthService {
    private hashOptions: argon2.Options;

    /**
     * Creates an instance of AuthService.
     * @param db - Knex instance.
     * @param sessionService - SessionService instance.
     * @param userService - UserService instance.
     * @param secret - Secret used for hashing.
     * @returns AuthService instance.
     */
    public constructor(
        private readonly db: Knex,
        private readonly sessionService: SessionService,
        private readonly userService: UserService,
        secret: string,
    ) {
        this.hashOptions = { secret: Buffer.from(secret) };
    }

    /**
     * Logs in a user via email and password.
     * @param email - The email of the user.
     * @param password - The password of the user.
     * @param userAgent - The user agent of the user.
     * @returns Session token.
     * @throws InvalidUsernameOrPasswordError if username or password is invalid.
     */
    public async login(
        email: string,
        password: string,
        userAgent: string,
    ): Promise<string> {
        const result = await this.db('users')
            .select('id', 'password_hash')
            .where('email', email)
            .first();
        if (!result) {
            throw new InvalidUsernameOrPasswordError();
        }

        const valid = await argon2.verify(
            result.password_hash,
            password,
            this.hashOptions,
        );

        if (!valid) {
            throw new InvalidUsernameOrPasswordError();
        }

        return await this.sessionService.create(result.id, userAgent);
    }

    /**
     * Registers a user.
     * @param email - The email of the user.
     * @param password - The password of the user.
     * @param name - The name of the user.
     * @param firstName - The first name of the user.
     * @param userAgent - The user agent of the user.
     * @returns Session token.
     * @throws EmailAlreadyExistsError if email already exists.
     */
    public async register(
        email: string,
        password: string,
        userAgent: string,
    ): Promise<string> {
        if (await this.userService.isUserEmailTaken(email)) {
            throw new EmailAlreadyExistsError();
        }

        verifyPasswordRequirements(password);

        const salt = crypto.randomBytes(16);
        const password_hash = await argon2.hash(password, {
            ...this.hashOptions,
            salt,
        });

        const [id] = await this.db('users').insert({
            email,
            password_hash,
            is_admin: 0,
        });

        return await this.sessionService.create(id, userAgent);
    }

    /**
     * Updates the password of a user.
     * @param userId - The id of the user.
     * @param password - The new password.
     * @param currentPassword - The current password.
     * @throws UserNotFoundError if user is not found.
     * @throws InvalidPasswordError if current password is invalid.
     */
    public async updatePassword(
        userId: number,
        password: string,
        currentPassword: string,
    ): Promise<void> {
        const result = await this.db('users')
            .select('password_hash')
            .where('id', userId)
            .first();
        if (!result) {
            throw new UserNotFoundError();
        }

        verifyPasswordRequirements(password);

        const valid = await argon2.verify(
            result.password_hash,
            currentPassword,
            this.hashOptions,
        );
        if (!valid) {
            throw new InvalidPasswordError();
        }

        const salt = crypto.randomBytes(16);
        const password_hash = await argon2.hash(password, {
            ...this.hashOptions,
            salt,
        });

        await this.db('users').where('id', userId).update({ password_hash });
    }
}

function verifyPasswordRequirements(password: string) {
    if (password.length < 8) throw new PasswordRequirementUnmetError();
}
