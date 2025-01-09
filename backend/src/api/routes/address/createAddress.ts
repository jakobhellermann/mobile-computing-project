import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import AddressService from '../../../services/address';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Creates a new address',
    tags: ['addresses'],
    body: {
        type: 'object',
        required: ['name', 'firstName', 'street', 'city', 'zip', 'country'],
        properties: {
            name: { type: 'string' },
            firstName: { type: 'string' },
            company: { type: 'string' },
            street: { type: 'string' },
            city: { type: 'string' },
            zip: { type: 'string' },
            country: { type: 'string' },
        },
    },
} as const;

export function createAddress(
    addressService: AddressService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.post(
            '/user/addresses',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                fastify.log.debug(`creating new address`, request.body);

                await addressService.createAddress(request.user, {
                    city: request.body.city,
                    company: request.body.company,
                    country: request.body.country,
                    firstName: request.body.firstName,
                    name: request.body.name,
                    street: request.body.street,
                    zip: request.body.zip,
                });

                return reply.status(204).send();
            },
        );
    };
}
