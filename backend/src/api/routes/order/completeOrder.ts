import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import OrderService from '../../../services/order';
import { OrderCannotBeCompleted, OrderNotFound } from '../../../errors/order';
import { isAdmin } from '../../prehandler/admin';

const schema = {
    description: 'Complete order',
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

export function completeOrder(
    orderService: OrderService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.put(
            '/orders/:id/complete',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                try {
                    await orderService.completeOrder(request.params.id);
                    return reply.status(204).send();
                } catch (error) {
                    if (error instanceof OrderNotFound) {
                        return reply
                            .status(404)
                            .send({ message: error.message });
                    }

                    if (error instanceof OrderCannotBeCompleted) {
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
