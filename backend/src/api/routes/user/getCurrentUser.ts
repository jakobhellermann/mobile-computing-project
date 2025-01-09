import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import UserService from '../../../services/user';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Gets the current user.',
    tags: ['users'],
} as const;

export function getCurrentUser(
    userService: UserService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/user',
            { schema, preHandler: authenticated(fastify) },
            async (request, reply) => {
                const user = await userService.getUser(request.user);
                return reply.send(user);
            },
        );
    };
}
