import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import AddressService from '../../../services/address';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Get all addresses of the authenticated user',
    tags: ['addresses'],
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    firstName: { type: 'string' },
                    company: { type: 'string' },
                    street: { type: 'string' },
                    city: { type: 'string' },
                    zip: { type: 'string' },
                    country: { type: 'string' },
                },
            },
        },
    },
} as const;

export function getAddresses(
    addressService: AddressService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/user/addresses',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                const addresses = await addressService.getAddresses(
                    request.user,
                );
                return reply.send(addresses);
            },
        );
    };
}
