/**
 * Error thrown when an unknown discount type is used.
 * @extends Error
 */
export class UnknownDiscountTypeError extends Error {
    constructor() {
        super('Unknown discount type');
    }
}

/**
 * Error thrown when a coupon is not found.
 * @extends Error
 */
export class CouponNotFoundError extends Error {
    constructor() {
        super('Coupon not found');
    }
}

/**
 * Error thrown when a coupon already exists.
 * @extends Error
 */
export class CouponAlreadyExistsError extends Error {
    constructor() {
        super('Coupon already exists');
    }
}
