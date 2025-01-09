import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import CouponService from '../../../services/coupon';
import { toDiscountType } from '../../../mappers/coupon';
import { isAdmin } from '../../prehandler/admin';

const schema = {
    description: 'Updates a coupon.',
    tags: ['coupons'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
    body: {
        type: 'object',
        properties: {
            code: { type: 'string' },
            discount: { type: 'number' },
            discountType: {
                type: 'string',
                enum: ['percentage', 'fixed'],
            },
            validUntil: { type: 'number' },
            minOrderValue: { type: 'number' },
        },
        required: ['code', 'discount', 'discountType', 'validUntil'],
    },
} as const;

export function updateCoupon(
    couponService: CouponService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.put(
            '/coupons/:id',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                const { id } = request.params;

                fastify.log.debug(
                    `updating coupon with id ${id}`,
                    request.body,
                );

                await couponService.updateCoupon(id, {
                    code: request.body.code,
                    discount: request.body.discount,
                    discountType: toDiscountType(request.body.discountType),
                    validUntil: request.body.validUntil,
                    minOrderValue: request.body.minOrderValue,
                });

                return reply.status(204).send();
            },
        );
    };
}
