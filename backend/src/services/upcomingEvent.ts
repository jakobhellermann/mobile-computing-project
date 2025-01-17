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
     * Upsert upcomingEvent, creating it if it didn't already.
     * @param type - Subscription Type.
     * @param name - Name/id.
     * @param timestamp - When the event occurs.
     */
    public async upsertUpcomingEvent(
        matchId: string,
        tournament: string,
        team1: string,
        team2: string,
        timestamp: Date,
    ): Promise<void> {
        this.db('upcomingEvents')
            .insert({
                matchId,
                tournament,
                team1,
                team2,
                timestamp: timestamp.getUTCMilliseconds(),
            })
            .onConflict().merge();
    }

    /**
     * Upsert many upcomingEvents, creating it if it didn't already.
     * @param type - Subscription Type.
     * @param name - Name/id.
     * @param timestamp - When the event occurs.
     */
    public async bulkUpsertUpcomingEvent(data: {
        matchId: string,
        tournament: string,
        team1: string,
        team2: string,
        timestamp: Date,
    }[]
    ): Promise<void> {
        if (data.length == 0) {
            return;
        };

        let rows = data.map(d => ({
            matchId: d.matchId,
            tournament: d.tournament,
            team1: d.team1,
            team2: d.team2,
            timestamp: d.timestamp.getTime(),
        }));
        await this.db('upcomingEvents')
            .insert(rows)
            .onConflict(["matchId"]).merge();
    }


    public async getSubscribedUpcomingEvents(userId: number): Promise<UpcomingEvent[]> {
        const events = await this.db('upcomingEvents')
            .select();
        return events.map(toUpcomingEvent);
    }

    /**
     * Upsert many upcomingEvents, creating it if it didn't already.
     * @param type - Subscription Type.
     * @param name - Name/id.
     * @param timestamp - When the event occurs.
     */
    public async getAll(): Promise<UpcomingEvent[]> {
        const events = await this.db('upcomingEvents')
            .select();
        return events.map(toUpcomingEvent);
    }
}
