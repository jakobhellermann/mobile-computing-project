import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import OrderService from '../../../services/order';
import { OrderNotFound } from '../../../errors/order';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Get order products by id',
    tags: ['orders'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
} as const;

export function getOrderItems(
    orderService: OrderService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/orders/:id/items',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                try {
                    const order = await orderService.getOrderItems(
                        request.params.id,
                        request.user,
                        true,
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
