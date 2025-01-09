import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import AuthService, { InvalidPasswordError } from '../../../services/auth';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Update the password of the current user',
    tags: ['users'],
    body: {
        type: 'object',
        properties: {
            password: { type: 'string' },
            currentPassword: { type: 'string' },
        },
        required: ['password', 'currentPassword'],
    },
    response: {
        204: {
            type: 'null',
        },
        403: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
} as const;

export function updatePassword(
    authService: AuthService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.put(
            '/user/password',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                try {
                    await authService.updatePassword(
                        request.user,
                        request.body.password,
                        request.body.currentPassword,
                    );

                    return reply.code(204).send();
                } catch (err) {
                    if (err instanceof InvalidPasswordError) {
                        return reply.code(403).send({
                            message: err.message,
                        });
                    }

                    throw err;
                }
            },
        );
    };
}
