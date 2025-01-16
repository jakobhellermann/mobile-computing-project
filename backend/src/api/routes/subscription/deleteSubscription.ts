import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import SubscriptionService from '../../../services/subscription';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Delete a subscription',
    tags: ['subscriptions'],
    params: {
        type: 'object',
        properties: {
            type: { type: 'string' },
            name: { type: 'string' },
        },
        required: ['type', 'name'],
    },
} as const;

export function deleteSubscription(
    subscriptionService: SubscriptionService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.delete(
            '/subscription/:type/:name',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                fastify.log.debug(`deleting subscription`, request.params.id);

                await subscriptionService.deleteSubscription(request.user, request.params.type, request.params.name);
                return reply.status(200).send();
            },
        );
    };
}


const schemaAll = {
    description: 'Delete all subscriptions',
    tags: ['subscriptions'],
} as const;

export function deleteAllSubscriptions(
    subscriptionService: SubscriptionService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.delete(
            '/subscriptions',
            {
                schema: schemaAll,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                fastify.log.debug(`deleting all subscriptions`);

                await subscriptionService.deleteAllSubscriptions(request.user);
                return reply.status(200).send();
            },
        );
    };
}
