import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';

import { api } from './api/api';
import ProductService from './services/product';
import AuthService from './services/auth';
import { connectDatabase } from './database';
import RatingService from './services/ratings';
import SessionService from './services/session';
import UserService from './services/user';
import OrderService from './services/order';
import AddressService from './services/address';
import CouponService from './services/coupon';
import StatsService from './services/stats';
import SubscriptionService from './services/subscription';
import LeagueService from './services/leaguepedia';

const STATIC_FILES = process.env.SERVE_STATIC;

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

let env = "development" as const;

const fastify = Fastify({
    logger: envToLogger[env],
});
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

    const productService = new ProductService(db);
    const sessionService = new SessionService(db);
    const addressService = new AddressService(db);
    const couponService = new CouponService(db);
    const orderService = new OrderService(
        productService,
        addressService,
        couponService,
        db,
    );
    const ratingService = new RatingService(db, productService, orderService);
    const subscriptionService = new SubscriptionService(db);
    const userService = new UserService(db);
    const authService = new AuthService(
        db,
        sessionService,
        userService,
        argon2Secret || 'supersecret',
    );
    const statsService = new StatsService(db);
    const leagueService = new LeagueService();

    await fastify.register(cors, {});
    await fastify.register(
        api(
            authService,
            productService,
            ratingService,
            subscriptionService,
            sessionService,
            userService,
            orderService,
            addressService,
            couponService,
            statsService,
            leagueService,
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
    });
})();
