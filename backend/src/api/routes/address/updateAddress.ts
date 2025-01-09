import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import AddressService from '../../../services/address';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Updates a address',
    tags: ['addresses'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
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

export function updateAddress(
    addressService: AddressService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.put(
            '/user/addresses/:id',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                const { id } = request.params;

                fastify.log.debug(
                    `updating address with id ${id}`,
                    request.body,
                );

                await addressService.updateAddress(request.user, {
                    id,
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
