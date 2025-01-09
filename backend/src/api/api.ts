import { FastifyPluginAsync } from 'fastify';
import fastifyAuth from '@fastify/auth';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

import AuthService from '../services/auth';
import SessionService from '../services/session';
import UserService from '../services/user';

import { authPlugin } from './plugins/auth';

import { login } from './routes/auth/login';
import { register } from './routes/auth/register';
import { logout } from './routes/auth/logout';
import { getCurrentUser } from './routes/user/getCurrentUser';
import { updatePassword } from './routes/user/updatePassword';
import { updateCurrentUser } from './routes/user/updateCurrentUser';

/**
 * Creates the API routes.
 *
 * @param authService - Auth service.
 * @param sessionService - Session service.
 * @param userService - User service.
 * @returns Fastify plugin.
 */
export function api(
    authService: AuthService,
    sessionService: SessionService,
    userService: UserService,
): FastifyPluginAsync {
    return async (fastify) => {
        await fastify.register(fastifyAuth);
        await fastify.register(authPlugin(sessionService));

        await fastify.register(fastifySwagger, {
            openapi: {
                openapi: '3.0.0',
                info: {
                    title: 'Shop',
                    description: 'Shop REST API documentation',
                    version: '1.0.0',
                },
            },
        });

        await fastify.register(fastifySwaggerUI, {
            routePrefix: '/docs',
        });

        await fastify.register(login(authService));
        await fastify.register(register(authService));
        await fastify.register(logout(sessionService));

        await fastify.register(updatePassword(authService));
        await fastify.register(getCurrentUser(userService));
        await fastify.register(updateCurrentUser(userService));
    };
}
