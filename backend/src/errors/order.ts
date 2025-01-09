/**
 * Base class for all order errors.
 */
export abstract class OrderError extends Error {}

/**
 * Error thrown when an order product is not found.
 * @extends OrderError
 */
export class OrderProductsNotFound extends OrderError {
    public constructor() {
        super('One or more products not found.');
    }
}

/**
 * Error thrown when an order product has not enough stock.
 * @extends OrderError
 */
export class OrderProductNotEnoughStock extends OrderError {
    public constructor(public readonly productId: number) {
        super(`Product ${productId} does not have enough stock.`);
    }
}

/**
 * Error thrown when an order is not found.
 * @extends OrderError
 */
export class OrderNotFound extends OrderError {
    public constructor(public readonly orderId: number) {
        super(`Order ${orderId} not found.`);
    }
}

/**
 * Error thrown when an order cannot be cancelled.
 * @extends OrderError
 */
export class OrderCannotBeCancelled extends OrderError {
    public constructor() {
        super('Order cannot be cancelled.');
    }
}

/**
 * Error thrown when an order cannot be completed.
 * @extends OrderError
 */
export class OrderCannotBeCompleted extends OrderError {
    public constructor() {
        super('Order cannot be completed.');
    }
}

/**
 * Error thrown when coupons are invalid.
 * @extends OrderError
 */
export class OrderCouponsInvalid extends OrderError {
    public constructor() {
        super('One or more coupons are invalid.');
    }
}
