import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { authenticated } from '../../prehandler/authenticated';
import SubscriptionService from '../../../services/subscription';

const schema = {
    description: 'Get all subscriptions of the authenticated user',
    tags: ['subscriptions'],
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    type: { type: 'string' },
                    timestamp: { type: 'number' },
                },
            },
        },
    },
} as const;

export function getSubscriptions(
    subscriptionService: SubscriptionService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/subscriptions',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                const addresses = await subscriptionService.getSubscriptionsByUser(
                    request.user,
                );
                return reply.send(addresses);
            },
        );
    };
}
