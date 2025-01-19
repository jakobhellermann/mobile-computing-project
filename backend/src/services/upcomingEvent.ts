import { Knex } from 'knex';
import { toUpcomingEvent } from '../mappers/upcomingEvent';
import { UpcomingEvent } from 'shared';

/**
 * Service for storing upcoming events
 */
export default class UpcomingEventService {
    /**
     * Creates an instance of UpcomingEventService.
     * @param db - Knex instance.
     * @returns UpcomingEventService instance.
     */
    public constructor(
        private readonly db: Knex,
    ) { }

    /**
     * Upsert many upcomingEvents, creating it if it didn't already.
     * @param type - Subscription Type.
     * @param name - Name/id.
     * @param timestamp - When the event occurs.
     */
    public async bulkUpsertUpcomingEvent(data: {
        matchId: string,
        tab: string,
        tournament: string,
        tournamentName: string,
        team1: string,
        team2: string,
        timestamp: Date,
    }[]
    ): Promise<void> {
        if (data.length === 0) {
            return;
        };

        let rows = data.map(d => ({
            matchId: d.matchId,
            tournament: d.tournament,
            tournamentName: d.tournamentName,
            tab: d.tab,
            team1: d.team1,
            team2: d.team2,
            timestamp: d.timestamp.getTime(),
        }));
        await this.db('upcomingEvents')
            .insert(rows)
            .onConflict(["matchId"]).merge();
    }


    /**
     * Fetch upcoming events according to the users notification preferences
     * @param userId The user whose subscriptions are respected
     * @param onlyNotifications When true, only subscriptions with enabled notifications will be counted
     */
    public async getSubscribedUpcomingEvents(userId: number, onlyNotifications: boolean = false): Promise<UpcomingEvent[]> {
        let notificationsFilter = onlyNotifications ? { notifications: true } : {};
        const events = await this.db('upcomingEvents')
            .whereIn("matchId", this.db("subscriptions").where({ user: userId, "type": "match", ...notificationsFilter }).select('name'))
            .orWhereIn("team1", this.db("subscriptions").where({ user: userId, "type": "team", ...notificationsFilter }).select('name'))
            .orWhereIn("team2", this.db("subscriptions").where({ user: userId, "type": "team", ...notificationsFilter }).select('name'))
            .orWhereIn("tournament", this.db("subscriptions").where({ user: userId, "type": "tournament", ...notificationsFilter }).select('name'))
            .select();
        return events.map(toUpcomingEvent);
    }

    /**
     * Upsert many upcomingEvents, creating it if it didn't already.
     * @param type - Subscription Type.
     * @param name - Name/id.
     * @param timestamp - When the event occurs.
     */
    public async getAll(options?: { beforeDate?: Date; onlyUnnotified?: boolean; }): Promise<UpcomingEvent[]> {
        let beforeDate = options?.beforeDate;
        let onlyUnnotified = options?.onlyUnnotified;

        let query = this.db('upcomingEvents');
        if (beforeDate) {
            query = query.where("timestamp", "<", beforeDate.getTime());
        }
        if (onlyUnnotified) {
            query = query.where({ "has_notified_start": false });
        }
        const events = await query.select();
        return events.map(toUpcomingEvent);
    }

    /**
     * Mark some upcoming events as having been notified
     * @param eventsToMark The events which were notified
     */
    public async markNotified(eventsToMark: UpcomingEvent[]): Promise<void> {
        let rowsAffected = await this.db('upcomingEvents')
            .whereIn("matchId", eventsToMark.map(x => x.matchId))
            .update({ "has_notified_start": true });
        if (rowsAffected !== eventsToMark.length) {
            console.warn(`mismatch: ${rowsAffected} !== ${eventsToMark.length}`);
        }
    }
}
