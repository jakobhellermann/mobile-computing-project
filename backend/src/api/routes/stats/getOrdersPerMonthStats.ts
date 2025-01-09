import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { isAdmin } from '../../prehandler/admin';
import StatsService from '../../../services/stats';

const schema = {
    description: 'Get the number of orders per month',
    tags: ['stats'],
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    month: { type: 'string' },
                    orders: { type: 'number' },
                },
            },
        },
    },
    querystring: {
        type: 'object',
        properties: {
            start: { type: 'number' },
            end: { type: 'number' },
            limit: { type: 'number' },
        },
    },
} as const;

export function getOrdersPerMonthStats(
    statsService: StatsService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/stats/orders/per-month',
            { schema, preHandler: isAdmin(fastify) },
            async (request, reply) => {
                const { end, start, limit } = request.query;

                const stats = await statsService.getOrdersPerMonth({
                    limit,
                    end: end ? new Date(end) : undefined,
                    start: start ? new Date(start) : undefined,
                });

                return reply.send(stats);
            },
        );
    };
}
