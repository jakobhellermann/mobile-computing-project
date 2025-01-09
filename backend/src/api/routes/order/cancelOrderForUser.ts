import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import OrderService from '../../../services/order';
import { OrderCannotBeCancelled, OrderNotFound } from '../../../errors/order';
import { isAdmin } from '../../prehandler/admin';

const schema = {
    description: 'Cancel order for user',
    tags: ['orders'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' }, userId: { type: 'number' } },
        required: ['id', 'userId'],
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

export function cancelOrderForUser(
    orderService: OrderService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.put(
            '/orders/:userId/:id/cancel',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                try {
                    await orderService.cancelOrder(
                        request.params.id,
                        request.params.userId,
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
