import { Knex } from 'knex';
import { Subscription } from 'shared';
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
     * Update subscription, creating it if it didn't already.
     * @param userId - User id.
     * @param name - Name.
     * @param type - Type.
     */
    public async updateSubscription(
        userId: number,
        type: string,
        name: string,
        notifications?: boolean
    ): Promise<void> {
        let existing = (await this.db('subscriptions').where({ user: userId, name, type }).select());
        console.log(`updating subscription ${type}/${name} (did exist: ${existing.length > 0})`);
        console.log(existing);
        if (existing.length === 0) {
            await this.db('subscriptions').insert({
                user: userId,
                name,
                type,
                notifications: notifications ?? false,
                timestamp: Date.now(),
            });
        } else {
            await this.db('subscriptions').where({ user: userId, name, type }).update({
                user: userId,
                name,
                type,
                notifications,
            });
        }
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

    public async getSubscription(userId: number, type: string, name: string): Promise<Subscription | null> {
        const row = await this.db('subscriptions')
            .where({ user: userId, type: type, name })
            .select();
        if (row.length === 0) return null;

        return toSubscription(row[0]);
    }

    public async getAllSubscriptions(): Promise<(Subscription & { userId: number; })[]> {
        const rows = await this.db('subscriptions')
            .select();

        return rows.map(row => ({ ...toSubscription(row), userId: row.user }));
    }


    public async getSubscribedUsers(filter: { match: string, teams: [string, string], tournament: string; }, onlyNotifications: boolean): Promise<{ user: number; pushToken: string | null; }[]> {
        let notificationsFilter = onlyNotifications ? { notifications: true } : {};

        // these `as any` are necessary because typescript doesn't recognize the prefixed 'subscriptions.name',
        // but without the prefix sqlite complains about ambiguous column names.
        const rows = await this.db('subscriptions')
            .where({ 'subscriptions.name': filter.match, type: "match", ...notificationsFilter } as any)
            .orWhere({ 'subscriptions.name': filter.tournament, type: "tournament", ...notificationsFilter } as any)
            .orWhere({ 'subscriptions.name': filter.teams[0], type: "team", ...notificationsFilter } as any)
            .orWhere({ 'subscriptions.name': filter.teams[1], type: "team", ...notificationsFilter } as any)
            .join("users", { "users.id": "subscriptions.user" })
            .select(['user', 'users.push_token as pushToken']);

        return rows.map(row => ({ user: row.user, pushToken: row.pushToken }));
    }



    /**
     * Delete subscription.
     * @param subscriptionId - Subscription id.
     * @param userId - User id.
     * @throws SubscriptionNotFoundError if subscription is not found.
     */
    public async deleteSubscription(userId: number, type: string, name: string): Promise<void> {
        console.log(`deleting subscription ${type}/${name}`);
        const rowsAffected = await this.db('subscriptions')
            .where({ user: userId, type, name })
            .delete();
        if (rowsAffected === 0) {
            console.warn(`No subscriptions deleted for ${type}/${name}`);
        }
        if (rowsAffected > 1) {
            console.error("Affected multiple rows?");
        }
    }

    /**
     * Delete all subscriptions of the user.
     * @param userId - User id.
     */
    public async deleteAllSubscriptions(userId: number): Promise<void> {
        await this.db('subscriptions')
            .where({ user: userId })
            .delete();
    }
}
