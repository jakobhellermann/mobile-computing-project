import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import OrderService from '../../../services/order';
import { isAdmin } from '../../prehandler/admin';

const schema = {
    description: 'Get all orders of all users',
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

export function getAllOrders(
    orderService: OrderService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/orders/all',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                const order = await orderService.getOrders();
                return reply.send(order);
            },
        );
    };
}
