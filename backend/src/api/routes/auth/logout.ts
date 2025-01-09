import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import SessionService from '../../../services/session';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Logs out a user.',
    tags: ['auth'],
    response: {
        204: {
            type: 'null',
        },
        401: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
} as const;

export function logout(
    sessionService: SessionService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.post(
            '/logout',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                const token = await sessionService.revoke(request.token);
                return reply.clearCookie('session').send({ token });
            },
        );
    };
}
