import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import ProductService from '../../../services/product';

const schema = {
    description: 'Gets the top categories.',
    tags: ['categories'],
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    imageUrl: { type: 'string' },
                    count: { type: 'number' },
                    totalStock: { type: 'number' },
                },
                required: ['name', 'imageUrl', 'count', 'totalStock'],
            },
        },
    },
} as const;

export function getTopCategories(
    productService: ProductService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get('/categories/top', { schema }, async (request, reply) => {
            const categories = await productService.getTopCategories();
            return reply.send(categories);
        });
    };
}
