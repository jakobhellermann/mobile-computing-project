import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import AuthService, {
    InvalidUsernameOrPasswordError,
} from '../../../services/auth';
import cookie from '@fastify/cookie';

const MAX_AGE = 365 * 24 * 60 * 60;

const schema = {
    description: 'Logs in a user with email and password.',
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
        401: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
} as const;

export function login(
    authService: AuthService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.post('/login', { schema }, async (request, reply) => {
            const { email, password } = request.body;

            const userAgent = request.headers['user-agent'] ?? '';

            try {
                const token = await authService.login(
                    email,
                    password,
                    userAgent,
                );
                return reply
                    .header('Set-Cookie', createLoginCookie(token))
                    .send({ token });
            } catch (err) {
                if (err instanceof InvalidUsernameOrPasswordError) {
                    reply.status(401).send({ message: err.message });
                }

                throw err;
            }
        });
    };
}

export function createLoginCookie(token: string): string {
    return cookie.serialize('session', token, {
        path: '/',
        httpOnly: true,
        maxAge: MAX_AGE,
        secure: process.env.NODE_ENV === 'production',
    });
}
