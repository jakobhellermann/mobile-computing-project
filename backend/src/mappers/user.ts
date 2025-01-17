import { User } from 'shared';
import { UserRow } from '../database/rows';

/**
 * Convert user row to user.
 * @param row - User row.
 * @returns User.
 */
export function toUser(row: UserRow): User {
    return {
        id: row.id,
        email: row.email,
        isAdmin: row.is_admin === 1,
        hasPushToken: row.push_token !== null,
    };
}
