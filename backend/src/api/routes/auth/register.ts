import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import AuthService, { EmailAlreadyExistsError } from '../../../services/auth';
import { createLoginCookie } from './login';

const schema = {
    description: 'Registers a new user.',
    tags: ['auth'],
    body: {
        type: 'object',
        properties: {
            email: { type: 'string' },
            password: { type: 'string' },
        },
        required: ['email', 'password'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                token: { type: 'string' },
            },
        },
        409: {
            type: 'string',
        },
    },
} as const;

export function register(
    authService: AuthService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.post('/register', { schema }, async (request, reply) => {
            const { email, password} = request.body;

            const userAgent = request.headers['user-agent'] ?? '';

            try {
                const token = await authService.register(
                    email,
                    password,
                    userAgent,
                );

                return reply
                    .header('Set-Cookie', createLoginCookie(token))
                    .send({ token });
            } catch (err) {
                if (err instanceof EmailAlreadyExistsError) {
                    reply.status(409);
                    return reply.send({ statusCode: 409, error: "Conflict", message: err.message });
                } else {
                    throw err;
                }
            }
        });
    };
}
