import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import ProductService from '../../../services/product';

const schema = {
    description: 'Searches for products by query.',
    tags: ['products'],
    querystring: {
        type: 'object',
        properties: {
            query: { type: 'string' },
            category: { type: 'string' },
            page: { type: 'integer', default: 1 },
            pageSize: { type: 'integer', default: 20 },
        },
    },
} as const;

export function searchProducts(
    productService: ProductService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get('/products', { schema }, async (request, reply) => {
            const { query, category } = request.query;

            const products = await productService.searchProducts(
                query,
                category,
                {
                    page: request.query.page,
                    pageSize: request.query.pageSize,
                },
            );

            return reply.send(products);
        });
    };
}
