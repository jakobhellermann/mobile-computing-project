import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import CouponService from '../../../services/coupon';
import { isAdmin } from '../../prehandler/admin';
import { CouponNotFoundError } from '../../../errors/coupon';

const schema = {
    description: 'Get a coupon by id.',
    tags: ['coupons'],
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
        404: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Coupon not found' },
            },
        },
    },
} as const;

export function getCoupon(
    couponService: CouponService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/coupons/:id',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                const id = request.params.id;

                try {
                    const coupon = await couponService.getCouponById(id);
                    return reply.send(coupon);
                } catch (err) {
                    if (err instanceof CouponNotFoundError) {
                        return reply.status(404).send({ message: err.message });
                    }

                    throw err;
                }
            },
        );
    };
}
