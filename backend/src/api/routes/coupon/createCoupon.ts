import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import CouponService from '../../../services/coupon';
import { toDiscountType } from '../../../mappers/coupon';
import { CouponAlreadyExistsError } from '../../../errors/coupon';
import { isAdmin } from '../../prehandler/admin';

const schema = {
    description: 'Creates a new coupon.',
    tags: ['coupons'],
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
    response: {
        204: {
            type: 'null',
        },
        409: {
            type: 'object',
            properties: { message: { type: 'string' } },
            required: ['message'],
        },
    },
} as const;

export function createCoupon(
    couponService: CouponService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.post(
            '/coupons',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                fastify.log.debug(`creating new coupon`, request.body);

                try {
                    await couponService.createCoupon({
                        code: request.body.code,
                        discount: request.body.discount,
                        discountType: toDiscountType(request.body.discountType),
                        validUntil: request.body.validUntil,
                        minOrderValue: request.body.minOrderValue,
                    });

                    return reply.status(204).send();
                } catch (err) {
                    if (err instanceof CouponAlreadyExistsError) {
                        return reply.status(409).send({
                            message: err.message,
                        });
                    }

                    throw err;
                }
            },
        );
    };
}
