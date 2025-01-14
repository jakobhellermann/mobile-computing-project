import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import SubscriptionService from '../../../services/subscription';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Register a new subscription',
    tags: ['subscriptions'],
    body: {
        type: 'object',
        required: ['name', 'type'],
        properties: {
            name: { type: 'string' },
            type: { type: 'string' },
        },
    },
} as const;

export function createSubscription(
    subscriptionService: SubscriptionService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.post(
            '/subscriptions',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                fastify.log.debug(`creating new subscription`, request.body);

                await subscriptionService.createSubscription(
                    request.user,
                    request.body.name,
                    request.body.type,
                );

                return reply.status(204).send();
            },
        );
    };
}
