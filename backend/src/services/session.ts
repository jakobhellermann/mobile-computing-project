import { Knex } from 'knex';
import uid from 'uid-safe';
import { createHash } from 'crypto';

// Token lifetime: 1 week
const TOKEN_LIFETIME = 1000 * 60 * 60 * 24 * 7;

/**
 * Error thrown when token is invalid or expired.
 * @extends Error
 */
export class InvalidOrExpiredTokenError extends Error {
    public constructor() {
        super('Invalid or expired token');
    }
}

/**
 * Session data.
 *
 * @property user - User id.
 * @property token - The session token.
 */
export type Session = {
    user: number;
    token: string;
};

/**
 * Service for managing sessions.
 */
export default class SessionService {
    /**
     * Creates an instance of SessionService.
     * @param db - Knex instance.
     * @returns SessionService instance.
     */
    public constructor(private readonly db: Knex) {}

    /**
     * Create session.
     *
     * @param userId - User id.
     * @param userAgent - User agent.
     * @returns Token.
     */
    public async create(userId: number, userAgent: string): Promise<string> {
        const token = await uid(32);
        const tokenHash = createHash('sha256').update(token).digest('hex');

        await this.db('sessions').insert({
            user: userId,
            token_hash: tokenHash,
            user_agent: userAgent,
            last_used_at: Date.now(),
            created_at: Date.now(),
        });

        return token;
    }

    /**
     * Revoke session.
     *
     * @param token - Token.
     */
    public async revoke(token: string): Promise<void> {
        const tokenHash = createHash('sha256').update(token).digest('hex');
        await this.db('sessions').where('token_hash', tokenHash).delete();
    }

    /**
     * Validate session.
     *
     * @param token - Token.
     * @returns Session.
     * @throws InvalidOrExpiredTokenError if token is invalid or expired.
     */
    public async validate(token: string): Promise<Session> {
        const tokenHash = createHash('sha256').update(token).digest('hex');
        const session = await this.db('sessions')
            .where('token_hash', tokenHash)
            .first();

        if (!session || this.isExpired(session.created_at, TOKEN_LIFETIME)) {
            throw new InvalidOrExpiredTokenError();
        }

        await this.db('sessions')
            .where('id', session.id)
            .update('last_used_at', Date.now());

        return {
            user: session.user,
            token,
        };
    }

    /**
     * Check if token is expired.
     *
     * @param createdAt - Token creation time.
     * @param lifetime - Token lifetime.
     * @returns True if token is expired, false otherwise.
     */
    private isExpired(createdAt: number, lifetime: number): boolean {
        return createdAt < Date.now() - lifetime;
    }
}
