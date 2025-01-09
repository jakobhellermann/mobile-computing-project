import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import RatingService from '../../../services/ratings';
import { ProductNotFoundError } from '../../../errors/product';
import { RatingError } from '../../../errors/rating';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Rates a product.',
    tags: ['products'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
    body: {
        type: 'object',
        properties: {
            rating: { type: 'number', minimum: 1, maximum: 5 },
            comment: { type: 'string' },
            title: { type: 'string' },
        },
        required: ['rating'],
    },
    response: {
        204: {},
        404: {
            type: 'object',
            properties: { message: { type: 'string' } },
        },
    },
} as const;

export function rateProduct(
    ratingService: RatingService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.post(
            '/products/:id/ratings',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                fastify.log.debug(
                    `rating product ${request.params.id}`,
                    request.body,
                );

                try {
                    await ratingService.createRating(
                        request.user,
                        request.params.id,
                        request.body.rating,
                        request.body.comment,
                        request.body.title,
                    );
                } catch (err) {
                    if (err instanceof ProductNotFoundError) {
                        return reply.status(404).send({ message: err.message });
                    } else if (err instanceof RatingError) {
                        return reply.status(409).send({ message: err.message });
                    }

                    throw err;
                }

                return reply.status(204).send();
            },
        );
    };
}
