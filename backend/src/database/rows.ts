import { Knex } from 'knex';

/**
 * User row in the database.
 */
export type UserRow = {
    id: number;
    email: string;
    password_hash: string;
    is_admin: number;
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


// Define the types for knex.
declare module 'knex/types/tables' {
    /**
     * Tables in the database.
     * The keys are table names and the values are the table types.
     */
    interface Tables {
        users: Knex.CompositeTableType<UserRow, Omit<UserRow, 'id'>>;
        subscriptions: Knex.CompositeTableType<SessionRow, Omit<SessionRow, 'id'>>;
    }
}

// Define the types for knex.
declare module 'knex/types/result' {
    interface Registry {
        Count: number;
    }
}
