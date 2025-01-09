import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import UserService, { UserNotFoundError } from '../../../services/user';
import { isAdmin } from '../../prehandler/admin';

const schema = {
    description: 'Gets a user.',
    tags: ['users'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                name: { type: 'string' },
                firstName: { type: 'string' },
                isAdmin: { type: 'boolean' },
            },
        },
        404: {
            type: 'object',
            properties: { message: { type: 'string' } },
        },
    },
} as const;

export function getUser(
    userService: UserService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/users/:id',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                const id = request.params.id;
                fastify.log.info(`getting user with id ${id}`);

                try {
                    const user = await userService.getUser(id);
                    return reply.send(user);
                } catch (err) {
                    if (err instanceof UserNotFoundError) {
                        return reply.status(404).send({ message: err.message });
                    }

                    throw err;
                }
            },
        );
    };
}
