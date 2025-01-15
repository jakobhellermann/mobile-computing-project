import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { authenticated } from '../../prehandler/authenticated';
import SubscriptionService from '../../../services/subscription';
import { ApiNotFoundError } from '../../../errors/api';

export function getSubscription(
    subscriptionService: SubscriptionService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/subscription/:type/:name',
            {
                schema: {
                    description: 'Get all specific notification',
                    tags: ['subscriptions'],
                    params: {
                        type: 'object',
                        properties: {
                            type: { type: 'string' },
                            name: { type: 'string' },
                        },
                        required: ['type', 'name'],
                    },
                    response: {
                        200: {
                            type: 'object',
                            nullable: true,
                            properties: {
                                type: { type: 'string' },
                                name: { type: 'string' },
                                notifications: { type: 'boolean' },
                                timestamp: { type: 'number' },
                            },
                        },
                    },
                } as const,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                const { type, name } = request.params;
                const subscription = await subscriptionService.getSubscription(
                    request.user, type, name
                );
                return reply.send(subscription);
            },
        );
    };
}

export function getSubscriptions(
    subscriptionService: SubscriptionService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/subscriptions',
            {
                schema: {
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
                                    notifications: { type: 'boolean' },
                                    timestamp: { type: 'number' },
                                },
                            },
                        },
                    },
                },
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

