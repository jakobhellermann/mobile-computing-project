import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import CouponService from '../../../services/coupon';
import { isAdmin } from '../../prehandler/admin';

const schema = {
    description: 'Get all coupons.',
    tags: ['coupons'],
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    code: { type: 'string' },
                    discount: { type: 'number' },
                    discountType: {
                        type: 'string',
                        enum: ['percentage', 'fixed'],
                    },
                    validUntil: { type: 'number' },
                    minOrderValue: { type: 'number' },
                },
            },
        },
    },
} as const;

export function getCoupons(
    couponService: CouponService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/coupons',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                const coupons = await couponService.getCoupons();
                return reply.send(coupons);
            },
        );
    };
}
