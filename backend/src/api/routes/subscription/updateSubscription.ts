import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import SubscriptionService from '../../../services/subscription';
import { authenticated } from '../../prehandler/authenticated';
import { SubscriptionType } from 'shared';
import { runUpdateMatches } from '../../../notificationJob/updateMatches';
import UpcomingEventService from '../../../services/upcomingEvent';

const schema = {
    description: 'Register a new subscription',
    tags: ['subscriptions'],
    params: {
        type: 'object',
        properties: {
            type: { type: 'string' },
            name: { type: 'string' },
        },
        required: ['type', 'name'],
    },
    body: {
        type: 'object',
        properties: {
            notifications: { type: 'boolean' },
        },
    },
    response: {
        404: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Address not found' },
            },
        },
    }
} as const;

export function updateSubscription(
    subscriptionService: SubscriptionService,
    upcomingEventService: UpcomingEventService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.put(
            '/subscription/:type/:name',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                fastify.log.debug(`creating new subscription`, request.body);

                await subscriptionService.updateSubscription(
                    request.user,
                    request.params.type as SubscriptionType,
                    request.params.name,
                    request.body?.notifications,
                );

                runUpdateMatches(subscriptionService, upcomingEventService).catch(console.error);

                return reply.status(204).send();
            },
        );
    };
}
