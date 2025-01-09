import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';

import { api } from './api/api';
import AuthService from './services/auth';
import { connectDatabase } from './database';
import SessionService from './services/session';
import UserService from './services/user';

const STATIC_FILES = process.env.SERVE_STATIC;

const fastify = Fastify({ logger: true });
if (STATIC_FILES) {
    console.log(`Serving ${STATIC_FILES}`);
    fastify.register(fastifyStatic, { root: STATIC_FILES });
    fastify.setNotFoundHandler((req, res) => res.sendFile('index.html'));
}

(async () => {
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

    await fastify.register(cors, {});
    await fastify.register(
        api(
            authService,
            sessionService,
            userService,
        ),
        {
            prefix: '/api',
        },
    );

    await db.migrate.latest();

    fastify.listen({ port: 3000, host: '::' }, async (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit();
        }

        console.log(`Listening at ${address}`);
    });
})();
