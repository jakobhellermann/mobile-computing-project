import { knex, Knex } from 'knex';
import path from 'path';

/**
 * Connect to the database.
 *
 * @returns Knex instance.
 */
export function connectDatabase(): Knex {
    const db = knex({
        client: 'better-sqlite3',
        useNullAsDefault: true,
        connection: {
            filename: './db.sqlite',
        },
        migrations: {
            directory: path.join(__dirname, './migrations'),
        },
        pool: {
            afterCreate: (
                connection: { pragma(q: string): void },
                cb: () => void,
            ) => {
                connection.pragma('foreign_keys = ON');
                cb();
            },
        },
    });

    return db;
}
