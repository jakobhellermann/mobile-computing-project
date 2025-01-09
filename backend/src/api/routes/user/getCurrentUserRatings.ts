import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import RatingService from '../../../services/ratings';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Get all ratings for the current user',
    tags: ['users'],
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    verified: { type: 'boolean' },
                    comment: { type: 'string' },
                    title: { type: 'string' },
                    rating: { type: 'number' },
                    timestamp: { type: 'number' },
                    product: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            productName: { type: 'string' },
                            price: { type: 'number' },
                            stockAmount: { type: 'number' },
                            description: { type: 'string' },
                            rating: { type: 'number' },
                            totalRatings: { type: 'number' },
                            images: {
                                type: 'array',
                                items: { type: 'string' },
                            },
                        },
                    },
                },
            },
        },
    },
} as const;

export function getCurrentUserRatings(
    ratingService: RatingService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/user/ratings',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                const ratings = await ratingService.getRatingsByUserId(
                    request.user,
                );

                return reply.send(ratings);
            },
        );
    };
}
