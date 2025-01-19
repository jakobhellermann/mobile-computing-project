import { Knex } from 'knex';

/**
 * User row in the database.
 */
export type UserRow = {
    id: number;
    email: string;
    password_hash: string;
    is_admin: number;

    push_token: string | null;
};

/**
 * Subscription row in the database.
 */
export type SubscriptionRow = {
    id: number;
    user: number;
    name: string;
    type: string;
    notifications: boolean;
    timestamp: number;
};

/**
 * Session row in the database.
 */
export type SessionRow = {
    id: number;
    user: number;
    token_hash: string;
    user_agent: string;
    last_used_at: number;
    created_at: number;
};

export type UpcomingEventRow = {
    matchId: string;

    tournament: string;
    tournamentName: string;
    tab: string;
    team1: string;
    team2: string;

    has_notified_start?: boolean;
    timestamp: number;
};

// Define the types for knex.
declare module 'knex/types/tables' {
    /**
     * Tables in the database.
     * The keys are table names and the values are the table types.
     */
    interface Tables {
        users: Knex.CompositeTableType<UserRow, Omit<UserRow, 'id'>>;
        sessions: Knex.CompositeTableType<SessionRow, Omit<SessionRow, 'id'>>;
        subscriptions: Knex.CompositeTableType<SubscriptionRow, Omit<SubscriptionRow, 'id'>>;
        upcomingEvents: Knex.CompositeTableType<UpcomingEventRow>;
    }
}

// Define the types for knex.
declare module 'knex/types/result' {
    interface Registry {
        Count: number;
    }
}
