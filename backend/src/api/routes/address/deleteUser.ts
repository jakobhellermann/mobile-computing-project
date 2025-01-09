import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import AddressService from '../../../services/address';
import { AddressNotFoundError } from '../../../errors/address';
import { authenticated } from '../../prehandler/authenticated';

const schema = {
    description: 'Deletes a address',
    tags: ['addresses'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
    response: {
        204: {
            type: 'null',
            description: 'Address deleted',
        },
        404: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Address not found' },
            },
        },
    },
} as const;

export function deleteAddress(
    addressService: AddressService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.delete(
            '/user/addresses/:id',
            {
                schema,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                const id = request.params.id;
                fastify.log.debug(`deleting address with id ${id}`);

                try {
                    await addressService.deleteAddress(id, request.user);
                    return reply.status(204).send();
                } catch (err) {
                    if (err instanceof AddressNotFoundError) {
                        return reply.status(404).send({ message: err.message });
                    }

                    throw err;
                }
            },
        );
    };
}
