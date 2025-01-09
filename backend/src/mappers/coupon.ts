import { Coupon, DiscountType } from 'web-shop-shared';
import { CouponRow } from '../database/rows';
import { UnknownDiscountTypeError } from '../errors/coupon';

/**
 * Convert discount type database string to a DiscountType.
 * @param type - the discount type as a string.
 * @returns DiscountType.
 */
export function toDiscountType(type: string): DiscountType {
    switch (type.toLowerCase()) {
        case 'percentage':
            return DiscountType.PERCENTAGE;
        case 'fixed':
            return DiscountType.FIXED;
        default:
            throw new UnknownDiscountTypeError();
    }
}

/**
 * Convert coupon row to coupon.
 * @param row - Coupon row.
 * @returns Coupon.
 */
export function toCoupon(row: CouponRow): Coupon {
    return {
        id: row.id,
        code: row.code,
        discount: row.discount,
        discountType: toDiscountType(row.discount_type),
        minOrderValue: row.min_order_value,
        validUntil: row.valid_until,
    };
}
