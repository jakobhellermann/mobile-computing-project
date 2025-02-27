import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import UserService from '../../../services/user';
import { EmailAlreadyExistsError } from '../../../services/auth';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Update the current user',
    tags: ['users'],
    body: {
        type: 'object',
        properties: {
            email: { type: 'string' },
            pushToken: { type: 'string' },
        },
    },
    response: {
        204: {
            type: 'null',
        },
        409: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
} as const;

export function updateCurrentUser(
    userService: UserService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.put(
            '/user',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                try {
                    await userService.updateUser(request.user, request.body);
                    return reply.status(204).send();
                } catch (err) {
                    if (err instanceof EmailAlreadyExistsError) {
                        reply.status(409);
                        return reply.send({ statusCode: 409, error: "Conflict", message: err.message });
                    }

                    throw err;
                }
            },
        );
    };
}
