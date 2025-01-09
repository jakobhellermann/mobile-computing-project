import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import OrderService from '../../../services/order';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Get all orders for the authenticated user',
    tags: ['orders'],
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    user: { type: 'number' },
                    status: { type: 'string' },
                    total: { type: 'number' },
                    timestamp: { type: 'number' },
                    firstName: { type: 'string' },
                    name: { type: 'string' },
                    company: { type: 'string' },
                    street: { type: 'string' },
                    city: { type: 'string' },
                    zip: { type: 'string' },
                    country: { type: 'string' },
                },
                required: [
                    'id',
                    'user',
                    'status',
                    'total',
                    'timestamp',
                    'firstName',
                    'street',
                    'city',
                    'zip',
                    'country',
                ],
            },
        },
    },
} as const;

export function getOrders(
    orderService: OrderService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/orders',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                const order = await orderService.getOrders(request.user);
                return reply.send(order);
            },
        );
    };
}
