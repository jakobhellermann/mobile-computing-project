import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import RatingService from '../../../services/ratings';
import { ProductNotFoundError } from '../../../errors/product';
import { RatingError } from '../../../errors/rating';
import { isAdmin } from '../../prehandler/admin';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Update a rating for a product',
    tags: ['ratings'],
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
        204: {
            type: 'null',
        },
        404: {
            type: 'object',
            properties: { message: { type: 'string' } },
        },
    },
} as const;

export function updateRating(
    ratingService: RatingService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.put(
            '/ratings/:id',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                fastify.log.debug(
                    `updating rating ${request.params.id}`,
                    request.body,
                );

                try {
                    await ratingService.updateRating(
                        request.params.id,
                        request.user,
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
