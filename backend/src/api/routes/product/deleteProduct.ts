import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { isAdmin } from '../../prehandler/admin';
import ProductService from '../../../services/product';
import { ProductNotFoundError } from '../../../errors/product';

const schema = {
    description: 'Deletes a product.',
    tags: ['products'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
    response: {
        204: {
            type: 'null',
            description: 'Product deleted',
        },
        404: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Product not found' },
            },
        },
    },
} as const;

export function deleteProduct(
    productService: ProductService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.delete(
            '/products/:id',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                const id = request.params.id;
                fastify.log.debug(`deleting product with id ${id}`);

                try {
                    await productService.deleteProduct(id);
                    return reply.status(204).send();
                } catch (err) {
                    if (err instanceof ProductNotFoundError) {
                        return reply.status(404).send({ message: err.message });
                    }

                    throw err;
                }
            },
        );
    };
}
