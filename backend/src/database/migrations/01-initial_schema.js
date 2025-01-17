const testUsers = [
    {
        id: 1,
        email: 'testuser-admin@example.de',
        password_hash:
            '$argon2id$v=19$m=19456,t=2,p=1$3DXNY3ps4eAq4aOUJbQW/Q$8nJaTGIFjjfZ+Geb/8YZeIzenlsmee6iYw86m751co4',
        is_admin: true,
        name: 'Some',
        first_name: 'Admin',
    },
    {
        id: 2,
        email: 'testuser-normal@example.de',
        password_hash:
            '$argon2id$v=19$m=19456,t=2,p=1$9ZHgWistHtoP5XW1r4JaEw$3LaPbmh5W3Q4t0ka8CisNJMoSYN1i1m2u9jmWjz1+8o',
        is_admin: false,
        name: 'Some',
        first_name: 'Customer',
    },
];

const testSubscriptions = [
    {
        "id": 1,
        "user": 2,
        "name": "Team 1",
        "type": "team",
        "notifications": true,
        "timestamp": 1736862070238
    },
    {
        "id": 2,
        "user": 2,
        "name": "Some tournament",
        "type": "tournament",
        "notifications": false,
        "timestamp": 1736862072752
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
            t.string('name').notNullable();
            t.string('first_name').notNullable();
            t.string('password_hash').notNullable();
            t.boolean('is_admin').notNullable();
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
