import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import CouponService from '../../../services/coupon';

const schema = {
    description: 'Validates a given coupon.',
    tags: ['coupons'],
    body: {
        type: 'object',
        properties: {
            code: { type: 'string' },
            total: { type: 'number' },
        },
        required: ['code', 'total'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                valid: { type: 'boolean' },
                reason: { type: 'string' },
                minOrderValue: { type: 'number' },
                discount: { type: 'number' },
            },
            required: ['valid'],
        },
    },
} as const;

export function checkCoupon(
    couponService: CouponService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.post(
            '/coupons/check',
            {
                schema,
            },
            async (request, reply) => {
                const result = await couponService.checkCoupon(
                    request.body.code,
                    request.body.total,
                );

                return reply.send(result);
            },
        );
    };
}
