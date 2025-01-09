import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import ProductService from '../../../services/product';
import { isAdmin } from '../../prehandler/admin';

const schema = {
    description: 'Creates a new product.',
    tags: ['products'],
    body: {
        type: 'object',
        properties: {
            productName: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stockAmount: { type: 'number' },
            images: { type: 'array', items: { type: 'string' } },
        },
        required: ['productName', 'price', 'category'],
    },
    response: {
        204: {},
    },
} as const;

export function createProduct(
    productService: ProductService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.post(
            '/products',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                fastify.log.debug(`creating new product`, request.body);

                const id = await productService.createProduct({
                    productName: request.body.productName,
                    description: request.body.description ?? '',
                    price: request.body.price,
                    stockAmount: request.body.stockAmount ?? 0,
                    images: request.body.images ?? [],
                    category: request.body.category,
                });

                fastify.log.debug(`product created with id: ${id}`);

                return reply.status(204).send();
            },
        );
    };
}
