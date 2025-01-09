import fastifyPlugin from 'fastify-plugin';
import { FastifyAuthFunction } from '@fastify/auth';
import UserService from '../../services/user';

declare module 'fastify' {
    interface FastifyInstance {
        isAdmin: FastifyAuthFunction;
    }

    interface FastifyRequest {
        admin: boolean;
    }
}

/**
 * Verifies that the user is an admin.
 * 
 * @param userService - User service.
 * @returns Fastify plugin.
 */
export function isAdminPlugin(userService: UserService) {
    return fastifyPlugin(async (fastify) => {
        fastify.decorate<FastifyAuthFunction>(
            'isAdmin',
            async (request, reply) => {
                const user = await userService.getUser(request.user);
                if (!user.isAdmin) {
                    return reply.code(403).send({ message: 'Forbidden' });
                }
            },
        );
    });
}
