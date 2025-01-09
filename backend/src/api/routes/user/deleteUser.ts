import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import UserService, { UserNotFoundError } from '../../../services/user';
import { isAdmin } from '../../prehandler/admin';

const schema = {
    description: 'Deletes a user.',
    tags: ['users'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
    response: {
        204: {
            type: 'null',
            description: 'User deleted',
        },
        404: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User not found' },
            },
        },
    },
} as const;

export function deleteUser(
    userService: UserService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.delete(
            '/users/:id',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                const id = request.params.id;
                fastify.log.debug(`deleting user with id ${id}`);

                try {
                    await userService.deleteUser(id);
                    return reply.status(204).send();
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
