import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import ProductService from '../../../services/product';
import { ProductNotFoundError } from '../../../errors/product';
import { isAdmin } from '../../prehandler/admin';

const schema = {
    description: 'Updates a product by id.',
    tags: ['products'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
    body: {
        type: 'object',
        properties: {
            productName: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            price: { type: 'number' },
            stockAmount: { type: 'number' },
            images: { type: 'array', items: { type: 'string' } },
        },
    },
    response: {
        204: {},
        404: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
} as const;

export function updateProduct(
    productService: ProductService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.patch(
            '/products/:id',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                const id = request.params.id;

                fastify.log.debug(`updating product ${id}`, request.body);

                try {
                    await productService.updateProduct(id, {
                        productName: request.body.productName,
                        description: request.body.description,
                        price: request.body.price,
                        stockAmount: request.body.stockAmount,
                        images: request.body.images,
                        category: request.body.category,
                    });
                } catch (err) {
                    if (err instanceof ProductNotFoundError) {
                        return reply.status(404).send({
                            message: err.message,
                        });
                    }

                    throw err;
                }

                return reply.status(204).send();
            },
        );
    };
}
