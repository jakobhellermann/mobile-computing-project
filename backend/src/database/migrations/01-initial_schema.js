const testUsers = [
    {
        id: 1,
        email: 'testuser-admin@example.de',
        password_hash:
            '$argon2id$v=19$m=19456,t=2,p=1$3DXNY3ps4eAq4aOUJbQW/Q$8nJaTGIFjjfZ+Geb/8YZeIzenlsmee6iYw86m751co4',
        is_admin: true,
    },
    {
        id: 2,
        email: 'testuser-normal@example.de',
        password_hash:
            '$argon2id$v=19$m=19456,t=2,p=1$9ZHgWistHtoP5XW1r4JaEw$3LaPbmh5W3Q4t0ka8CisNJMoSYN1i1m2u9jmWjz1+8o',
        is_admin: false,
    },
];

const testSubscriptions = [
    {
        "id": 3,
        "user": 2,
        "name": "Esports World Cup 2024",
        "type": "tournament",
        "notifications": true,
        "timestamp": 1737119495011
    },
    {
        "id": 4,
        "user": 2,
        "name": "Bilibili Gaming",
        "type": "team",
        "notifications": true,
        "timestamp": 1737119515106
    },
    {
        "id": 5,
        "user": 2,
        "name": "NLC/2025 Season/Winter Seeding",
        "type": "tournament",
        "notifications": true,
        "timestamp": 1737119543047
    },
    {
        "id": 6,
        "user": 2,
        "name": "LDL/2025 Season/Split 1_Week 1_16",
        "type": "match",
        "notifications": false,
        "timestamp": 1737119568019
    }
];

/** @typedef {import('knex').Knex} Knex */
/**
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
async function up(knex) {
    await knex.schema
        .createTable('users', (t) => {
            t.increments('id').primary();
            t.string('email').notNullable().unique();
            t.string('password_hash').notNullable();
            t.boolean('is_admin').notNullable();
            t.string('push_token');
        })
        .createTable('sessions', (t) => {
            t.increments('id').primary();
            t.integer('user')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');
            t.string('token_hash').notNullable().index();
            t.string('user_agent').notNullable();
            t.integer('last_used_at').notNullable();
            t.integer('created_at').notNullable();
        })
        .createTable('subscriptions', (t) => {
            t.increments('id').primary();
            t.integer('user')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');
            t.string('name').notNullable();
            t.string('type').notNullable();
            t.boolean('notifications').notNullable();
            t.integer('timestamp').notNullable();
        })
        .createTable('upcomingEvents', (t) => {
            t.string('matchId').primary();
            t.string('tournament').notNullable();
            t.string('tournamentName').notNullable();
            t.string('tab').notNullable();
            t.string('team1').notNullable();
            t.string('team2').notNullable();
            t.boolean('has_notified_start').defaultTo(false);
            t.integer('timestamp').notNullable();
        });

    await seedTestData(knex);
}

/** @typedef {import('knex').Knex} Knex */
/**
 * @param {Knex} db
 * @returns {Promise<void>}
 */
const seedTestData = async (db) => {
    await db('users').insert(testUsers);
    await db('subscriptions').insert(testSubscriptions);
};

/**
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
async function down(knex) {
    await knex.schema
        .dropTableIfExists('sessions')
        .dropTableIfExists('users');
}

module.exports = { up, down };
