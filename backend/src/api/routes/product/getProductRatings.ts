import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import RatingService from '../../../services/ratings';
import { ProductNotFoundError } from '../../../errors/product';

const schema = {
    description: "Get product's ratings.",
    tags: ['products'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    user: { type: 'number' },
                    verified: { type: 'boolean' },
                    comment: { type: 'string' },
                    title: { type: 'string' },
                    rating: { type: 'number' },
                    timestamp: { type: 'number' },
                },
            },
        },
        404: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
} as const;

export function getProductRatings(
    ratingService: RatingService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/products/:id/ratings',
            { schema },
            async (request, reply) => {
                fastify.log.debug(
                    `getting ratings for product ${request.params.id}`,
                );

                try {
                    const ratings = await ratingService.getRatingsByProductId(
                        request.params.id,
                    );

                    return reply.send(ratings);
                } catch (err) {
                    if (err instanceof ProductNotFoundError) {
                        return reply.status(404).send({
                            message: err.message,
                        });
                    }

                    throw err;
                }
            },
        );
    };
}
