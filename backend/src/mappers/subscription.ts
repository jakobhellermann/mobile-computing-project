import { SubscriptionRow } from '../database/rows';
import { Subscription } from 'shared';

/**
 * Convert rating row to rating.
 * @param row - Subscription row.
 * @returns Subscription.
 */
export function toSubscription(row: SubscriptionRow): Subscription {
    return {
        type: row.type,
        name: row.name,
        notifications: row.notifications ?? false,
        timestamp: row.timestamp,
    };
}
