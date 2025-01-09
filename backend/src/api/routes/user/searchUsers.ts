import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import UserService from '../../../services/user';
import { isAdmin } from '../../prehandler/admin';

const schema = {
    description: 'Searches for users.',
    tags: ['users'],
    querystring: {
        type: 'object',
        properties: {
            query: { type: 'string' },
            page: { type: 'integer', default: 1 },
            pageSize: { type: 'integer', default: 20 },
        },
    },
} as const;

export function searchUsers(
    userService: UserService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/users',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                const { query, page, pageSize } = request.query;
                const users = await userService.searchUsers(query, {
                    page,
                    pageSize,
                });

                return reply.send(users);
            },
        );
    };
}
