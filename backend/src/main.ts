import Fastify from 'fastify';
import cors from '@fastify/cors';

import { api } from './api/api';
import AuthService from './services/auth';
import { connectDatabase } from './database';
import SessionService from './services/session';
import UserService from './services/user';
import SubscriptionService from './services/subscription';
import LeagueService from './services/leaguepedia';
import { notificationsPlugin } from './notificationJob';
import UpcomingEventService from './services/upcomingEvent';

const envToLogger = {
    development: {
        transport: {
            target: 'pino-pretty',
            options: {
                ignore: 'pid,hostname',
            },
        },
    },
    production: true,
    test: false,
};

let env = "production" as const;

const fastify = Fastify({
    logger: envToLogger[env],
});

async function setup() {
    const db = connectDatabase();

    const argon2Secret = process.env.ARGON2_SECRET;
    if (!argon2Secret && process.env.NODE_ENV === 'production') {
        throw new Error('ARGON2_SECRET is not set');
    }

    const sessionService = new SessionService(db);
    const userService = new UserService(db);
    const authService = new AuthService(
        db,
        sessionService,
        userService,
        argon2Secret || 'supersecret',
    );
    const subscriptionService = new SubscriptionService(db);
    const upcomingEventService = new UpcomingEventService(db);
    const leagueService = new LeagueService();

    await db.migrate.latest();

    await fastify.register(cors, {});
    await fastify.register(
        api(
            authService,
            sessionService,
            userService,
            subscriptionService,
            leagueService,
            upcomingEventService,
        ),
        {
            prefix: '/api',
        },
    );
    await fastify.register(notificationsPlugin(subscriptionService, upcomingEventService));

    fastify.listen({ port: 3000, host: '::' }, async (err) => {
        if (err) {
            fastify.log.error(err);
            process.exit();
        }
    });
}

setup();