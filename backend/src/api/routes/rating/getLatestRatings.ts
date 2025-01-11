import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import RatingService from '../../../services/ratings';
import { UserRating } from 'shared';

const schema = {
    description: 'Get the latest ratings.',
    tags: ['ratings'],
} as const;

export function getLatestRatings(
    ratingService: RatingService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get<{
            Reply: Array<UserRating>;
        }>('/ratings', { schema }, async (request, reply) => {
            const ratings = await ratingService.getLatestRatings();
            return reply.send(ratings);
        });
    };
}
