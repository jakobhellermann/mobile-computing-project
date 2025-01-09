import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import CouponService from '../../../services/coupon';
import { CouponNotFoundError } from '../../../errors/coupon';
import { isAdmin } from '../../prehandler/admin';

const schema = {
    description: 'Deletes a coupon.',
    tags: ['coupons'],
    params: {
        type: 'object',
        properties: { id: { type: 'number' } },
        required: ['id'],
    },
    response: {
        204: {
            type: 'null',
            description: 'Coupon deleted',
        },
        404: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Coupon not found' },
            },
        },
    },
} as const;

export function deleteCoupon(
    couponService: CouponService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.delete(
            '/coupons/:id',
            {
                schema,
                preHandler: isAdmin(fastify),
            },
            async (request, reply) => {
                const id = request.params.id;
                fastify.log.debug(`deleting coupon with id ${id}`);

                try {
                    await couponService.deleteCoupon(id);
                    return reply.status(204).send();
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
