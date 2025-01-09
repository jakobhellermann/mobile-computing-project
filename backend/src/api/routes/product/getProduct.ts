import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import ProductService from '../../../services/product';
import { ProductNotFoundError } from '../../../errors/product';

const schema = {
    description: 'Gets a product by id.',
    tags: ['products'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                productName: { type: 'string' },
                description: { type: 'string' },
                category: { type: 'string' },
                price: { type: 'number' },
                stockAmount: { type: 'number' },
                rating: { type: 'number' },
                totalRatings: { type: 'number' },
                images: { type: 'array', items: { type: 'string' } },
            },
        },
        404: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
} as const;

export function getProduct(
    productService: ProductService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get('/products/:id', { schema }, async (request, reply) => {
            const id = request.params.id;

            try {
                const product = await productService.getProductById(id);
                return reply.send(product);
            } catch (err) {
                if (err instanceof ProductNotFoundError) {
                    return reply.status(404).send({
                        message: err.message,
                    });
                }

                throw err;
            }
        });
    };
}
