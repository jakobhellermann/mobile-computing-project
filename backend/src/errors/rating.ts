/**
 * Base class for rating errors.
 */
export abstract class RatingError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = 'RatingError';
    }
}

/**
 * Error thrown when a user has already rated a product.
 * @extends RatingError
 */
export class RatingUserAlreadyRatedError extends RatingError {
    public constructor() {
        super('User has already rated this product');
        this.name = 'RatingUserAlreadyRatedError';
    }
}

/**
 * Error thrown when a rating is not found.
 * @extends RatingError
 */
export class RatingNotFoundError extends RatingError {
    public constructor() {
        super('Rating not found');
        this.name = 'RatingNotFoundError';
    }
}
