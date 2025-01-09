import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import RatingService from '../../../services/ratings';
import { RatingNotFoundError } from '../../../errors/rating';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Deletes a rating.',
    tags: ['ratings'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
    response: {
        204: {
            type: 'null',
            description: 'Rating deleted',
        },
        404: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Rating not found' },
            },
        },
    },
} as const;

export function deleteRating(
    ratingService: RatingService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.delete(
            '/ratings/:id',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                const id = request.params.id;
                fastify.log.debug(`deleting rating with id ${id}`);

                try {
                    await ratingService.deleteRating(id, request.user);
                    return reply.status(204).send();
                } catch (err) {
                    if (err instanceof RatingNotFoundError) {
                        return reply.status(404).send({ message: err.message });
                    }

                    throw err;
                }
            },
        );
    };
}
