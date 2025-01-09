import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import OrderService from '../../../services/order';
import { OrderCannotBeCancelled, OrderNotFound } from '../../../errors/order';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Cancel order by id',
    tags: ['orders'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
    response: {
        204: {
            type: 'null',
        },
        404: {
            type: 'object',
            properties: { message: { type: 'string' } },
            required: ['message'],
        },
        409: {
            type: 'object',
            properties: { message: { type: 'string' } },
            required: ['message'],
        },
    },
} as const;

export function cancelOrder(
    orderService: OrderService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.put(
            '/orders/:id/cancel',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                try {
                    await orderService.cancelOrder(
                        request.params.id,
                        request.user,
                    );
                    return reply.status(204).send();
                } catch (error) {
                    if (error instanceof OrderNotFound) {
                        return reply
                            .status(404)
                            .send({ message: error.message });
                    }

                    if (error instanceof OrderCannotBeCancelled) {
                        return reply
                            .status(409)
                            .send({ message: error.message });
                    }

                    throw error;
                }
            },
        );
    };
}
