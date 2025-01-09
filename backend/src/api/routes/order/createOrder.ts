import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import OrderService from '../../../services/order';
import { OrderError } from '../../../errors/order';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Creates a new order.',
    tags: ['orders'],
    body: {
        type: 'object',
        properties: {
            items: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        product: { type: 'number' },
                        quantity: { type: 'number', minimum: 1 },
                    },
                    required: ['product', 'quantity'],
                },
                minItems: 1,
            },
            couponCodes: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            address: {
                type: 'number',
            },
        },
        required: ['items', 'address'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                user: { type: 'number' },
                status: { type: 'string' },
                total: { type: 'number' },
                timestamp: { type: 'number' },
            },
        },
        409: {
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
            required: ['error'],
        },
    },
} as const;

export function createOrder(
    orderService: OrderService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.post(
            '/orders',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                fastify.log.debug(`creating new order`, request.body);

                try {
                    const order = await orderService.createOrder(
                        request.user,
                        request.body.address,
                        request.body.items,
                        request.body.couponCodes,
                    );

                    return reply.send(order);
                } catch (err) {
                    if (err instanceof OrderError) {
                        return reply.status(409).send({
                            error: err.message,
                        });
                    }

                    throw err;
                }
            },
        );
    };
}
