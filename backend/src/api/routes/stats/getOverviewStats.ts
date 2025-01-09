import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { isAdmin } from '../../prehandler/admin';
import StatsService from '../../../services/stats';

const schema = {
    description: 'Get the number of orders per month',
    tags: ['stats'],
    response: {
        200: {
            type: 'object',
            properties: {
                totalOrders: { type: 'number' },
                totalProducts: { type: 'number' },
                totalStock: { type: 'number' },
                totalSold: { type: 'number' },
                totalRevenue: { type: 'number' },
            },
            required: [
                'totalOrders',
                'totalProducts',
                'totalStock',
                'totalSold',
                'totalRevenue',
            ],
        },
    },
} as const;

export function getOverviewStats(
    statsService: StatsService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/stats/overview',
            { schema, preHandler: isAdmin(fastify) },
            async (request, reply) => {
                const stats = await statsService.getOverviewStats();
                return reply.send(stats);
            },
        );
    };
}
