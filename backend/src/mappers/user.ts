import { User } from 'web-shop-shared';
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
        name: row.name,
        firstName: row.first_name,
        isAdmin: row.is_admin === 1,
    };
}
