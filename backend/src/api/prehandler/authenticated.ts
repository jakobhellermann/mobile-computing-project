import { FastifyInstance } from 'fastify';

/**
 * Pre-handler that checks if the user is authenticated.
 * 
 * @param fastify - Fastify instance.
 * @returns Fastify pre-handler.
 */
export const authenticated = (fastify: FastifyInstance) =>
    fastify.auth([fastify.validateSession]) as never;
