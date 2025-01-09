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
            name: { type: 'string' },
            firstName: { type: 'string' },
        },
        required: ['email', 'password', 'name', 'firstName'],
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
            const { email, password, name, firstName } = request.body;

            const userAgent = request.headers['user-agent'] ?? '';

            try {
                const token = await authService.register(
                    email,
                    password,
                    name,
                    firstName,
                    userAgent,
                );

                return reply
                    .header('Set-Cookie', createLoginCookie(token))
                    .send({ token });
            } catch (err) {
                if (err instanceof EmailAlreadyExistsError) {
                    return reply.status(409).send(err.message);
                } else {
                    throw err;
                }
            }
        });
    };
}
