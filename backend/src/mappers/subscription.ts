import { SubscriptionRow } from '../database/rows';
import { Subscription } from 'shared';

/**
 * Convert rating row to rating.
 * @param row - Subscription row.
 * @returns Subscription.
 */
export function toSubscription(row: SubscriptionRow): Subscription {
    return {
        id: row.id,
        user: row.user,
        name: row.name,
        type: row.type,
        timestamp: row.timestamp,
    };
}
