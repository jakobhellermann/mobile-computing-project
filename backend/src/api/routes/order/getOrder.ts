import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import OrderService from '../../../services/order';
import { OrderNotFound } from '../../../errors/order';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Get order by id',
    tags: ['orders'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
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
                name: { type: 'string' },
                firstName: { type: 'string' },
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
        404: {
            type: 'object',
            properties: { message: { type: 'string' } },
            required: ['message'],
        },
    },
} as const;

export function getOrder(
    orderService: OrderService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/orders/:id',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                try {
                    const order = await orderService.getOrder(
                        request.params.id,
                        request.user,
                    );
                    return reply.send(order);
                } catch (error) {
                    if (error instanceof OrderNotFound) {
                        return reply
                            .status(404)
                            .send({ message: error.message });
                    }

                    throw error;
                }
            },
        );
    };
}
