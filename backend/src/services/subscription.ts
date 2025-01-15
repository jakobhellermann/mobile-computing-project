import { Knex } from 'knex';
import { Subscription } from 'shared';
import {
    SubscriptionNotFoundError,
} from '../errors/subscription';
import { toSubscription } from '../mappers/subscription';

/**
 * Service for managing subscriptions.
 */
export default class SubscriptionService {
    /**
     * Creates an instance of SubscriptionService.
     * @param db - Knex instance.
     * @returns SubscriptionService instance.
     */

    public constructor(
        private readonly db: Knex,
    ) { }
    /**
     * Create subscription.
     * @param userId - User id.
     * @param name - Name.
     * @param type - Type.
     */
    public async createSubscription(
        userId: number,
        name: string,
        type: string,
    ): Promise<void> {
        await this.db('subscriptions').insert({
            user: userId,
            name,
            type,
            timestamp: Date.now(),
        });
    }

    /**
     * Get subscriptions by product id.
     * @param productId - Product id.
     * @returns Array of subscriptions.
     */
    public async getSubscriptionsByUser(userId: number, type?: string): Promise<Subscription[]> {
        let row;
        if (type) {
            row = await this.db('subscriptions')
                .where({ user: userId, type: type })
                .select();
        } else {
            row = await this.db('subscriptions')
                .where({ user: userId })
                .select();
        }


        return row.map(toSubscription);
    }

    /**
     * Delete subscription.
     * @param subscriptionId - Subscription id.
     * @param userId - User id.
     * @throws SubscriptionNotFoundError if subscription is not found.
     */
    public async deleteSubscription(subscriptionId: number, userId: number): Promise<void> {
        const rowsAffected = await this.db('subscriptions')
            .where({ id: subscriptionId, user: userId })
            .delete();
        if (rowsAffected === 0) {
            throw new SubscriptionNotFoundError();
        }
    }

    /**
     * Get subscription by id.
     * @param id - Subscription id.
     * @param userId - User id.
     * @returns Subscription.
     * @throws SubscriptionNotFoundError if subscription is not found.
     */
    private async getSubscriptionById(id: number, userId: number) {
        const row = await this.db('subscriptions')
            .where({ id, user: userId })
            .select()
            .first();

        if (!row) {
            throw new SubscriptionNotFoundError();
        }

        return toSubscription(row);
    }
}
