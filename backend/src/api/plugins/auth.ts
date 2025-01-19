import fastifyPlugin from 'fastify-plugin';
import SessionService from '../../services/session';
import { FastifyAuthFunction } from '@fastify/auth';
import { FastifyRequest } from 'fastify';
import cookie from '@fastify/cookie';

declare module 'fastify' {
    interface FastifyInstance {
        validateSession: FastifyAuthFunction;
    }

    interface FastifyRequest {
        user: number;
        token: string;
    }
}

/**
 * Verifies that the user is authenticated.
 * 
 * @param sessionService - Session service.
 * @returns Fastify plugin.
 */
export function authPlugin(sessionService: SessionService) {
    return fastifyPlugin(async (fastify) => {
        fastify.decorate<FastifyAuthFunction>(
            'validateSession',
            async (request, reply) => {
                const token = extractSessionToken(request);
                if (!token) {
                    throw new Error('no token provided');
                }

                const session = await sessionService.validate(token);

                request.user = session.user;
                request.token = token;
            },
        );
    });
}

/**
 * Extracts the session token from the request.
 * 
 * @param request - Fastify request.
 * @returns Session token or undefined.
 */
function extractSessionToken(request: FastifyRequest): string | undefined {
    let authorization = request.headers.authorization;
    if (!authorization) return undefined;

    if (authorization.toLowerCase().startsWith("bearer")) {
        return authorization.substring("bearer ".length);
    }

    const cookies = request.headers.cookie;
    if (cookies) {
        return cookie.parse(cookies)['session'];
    }
}
