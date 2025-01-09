import fastifyPlugin from 'fastify-plugin';
import SessionService from '../../services/session';
import { FastifyAuthFunction } from '@fastify/auth';
import cookie from '@fastify/cookie';
import { FastifyRequest } from 'fastify';

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
    const cookies = request.headers.cookie;

    if (!cookies) {
        return undefined;
    }

    return cookie.parse(cookies)['session'];
}
