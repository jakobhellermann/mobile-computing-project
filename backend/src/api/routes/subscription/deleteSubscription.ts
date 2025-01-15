import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import SubscriptionService from '../../../services/subscription';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Register a new subscription',
    tags: ['subscriptions'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
} as const;

export function deleteSubscription(
    subscriptionService: SubscriptionService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.post(
            '/subscriptions/:id',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                fastify.log.debug(`deleting subscription`, request.params.id);

                await subscriptionService.deleteSubscription(request.params.id, request.user);
                return reply.status(200).send();
            },
        );
    };
}
