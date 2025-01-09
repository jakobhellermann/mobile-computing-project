import { Knex } from 'knex';
import { Coupon, CouponValidationResult, DiscountType } from 'web-shop-shared';
import { toCoupon } from '../mappers/coupon';
import {
    CouponAlreadyExistsError,
    CouponNotFoundError,
} from '../errors/coupon';

/**
 * Service for managing coupons.
 */
export default class CouponService {
    /**
     * Creates an instance of CouponService.
     * @param db - Knex instance.
     * @returns CouponService instance.
     */
    public constructor(private readonly db: Knex) {}

    /**
     * Create coupon.
     * @param coupon - Coupon data.
     * @throws CouponAlreadyExistsError if coupon already exists.
     */
    public async createCoupon(coupon: Omit<Coupon, 'id'>) {
        const existingCoupon = await this.getCoupon(coupon.code);
        if (existingCoupon) {
            throw new CouponAlreadyExistsError();
        }

        await this.db('coupons').insert({
            code: coupon.code,
            discount: coupon.discount,
            discount_type: coupon.discountType,
            min_order_value: coupon.minOrderValue,
            valid_until: coupon.validUntil,
        });
    }

    /**
     * Update coupon.
     * @param id - Coupon id.
     * @param coupon - Coupon data.
     * @throws CouponNotFoundError if coupon is not found.
     */
    public async updateCoupon(id: number, coupon: Omit<Coupon, 'id'>) {
        const rowsAffected = await this.db('coupons').where('id', id).update({
            code: coupon.code,
            discount: coupon.discount,
            discount_type: coupon.discountType,
            min_order_value: coupon.minOrderValue,
            valid_until: coupon.validUntil,
        });

        if (rowsAffected === 0) {
            throw new CouponNotFoundError();
        }
    }

    /**
     * Delete coupon.
     * @param id - Coupon id.
     * @throws CouponNotFoundError if coupon is not found.
     */
    public async deleteCoupon(id: number) {
        const rowsAffected = await this.db('coupons').where('id', id).delete();
        if (rowsAffected === 0) {
            throw new CouponNotFoundError();
        }
    }

    /**
     * Get all coupons.
     * @returns Array of coupons.
     */
    public async getCoupons(): Promise<Coupon[]> {
        const rows = await this.db('coupons').select();
        return rows.map(toCoupon);
    }

    /**
     * Get coupon by code.
     * @param code - Coupon code.
     * @returns Coupon or null if not found.
     */
    public async getCoupon(code: string): Promise<Coupon | null> {
        const row = await this.db('coupons').where('code', code).first();
        if (!row) {
            return null;
        }

        return toCoupon(row);
    }

    /**
     * Get coupon by id.
     * @param id - Coupon id.
     * @returns Coupon.
     * @throws CouponNotFoundError if coupon is not found.
     */
    public async getCouponById(id: number): Promise<Coupon> {
        const row = await this.db('coupons').where('id', id).first();
        if (!row) {
            throw new CouponNotFoundError();
        }

        return toCoupon(row);
    }

    /**
     * Check if coupon is valid.
     * @param code - Coupon code.
     * @param total - Total price.
     * @returns CouponValidationResult.
     */
    public async checkCoupon(
        code: string,
        total: number,
    ): Promise<CouponValidationResult> {
        const coupon = await this.getCoupon(code);
        if (!coupon) {
            return {
                valid: false,
                reason: 'not_found',
            };
        }

        if (coupon.minOrderValue && coupon.minOrderValue > total) {
            return {
                valid: false,
                reason: 'min_order_value',
                minOrderValue: coupon.minOrderValue,
            };
        }

        if (coupon.validUntil < Date.now()) {
            return {
                valid: false,
                reason: 'expired',
            };
        }

        let discount = 0;
        if (coupon.discountType === DiscountType.PERCENTAGE) {
            discount = (total * coupon.discount) / 100;
        } else {
            discount = coupon.discount;
        }

        if (total < discount) {
            return {
                valid: false,
                reason: 'min_order_value',
                minOrderValue: discount,
            };
        }

        return {
            valid: true,
            discount,
            minOrderValue: coupon.minOrderValue,
        };
    }
}
