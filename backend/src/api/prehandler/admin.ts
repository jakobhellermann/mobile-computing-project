import { FastifyInstance } from 'fastify';

/**
 * Pre-handler that checks if the user is an admin.
 * 
 * @param fastify - Fastify instance.
 * @returns Fastify pre-handler.
 */
export const isAdmin = (fastify: FastifyInstance) =>
    fastify.auth([fastify.validateSession, fastify.isAdmin], {
        relation: 'and',
    }) as never;
