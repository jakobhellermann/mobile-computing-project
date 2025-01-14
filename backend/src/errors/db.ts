/**
 * Base class for subscription errors.
 */
export abstract class SubscriptionError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = 'SubscriptionError';
    }
}

/**
 * Error thrown when a subscription is not found.
 * @extends SubscriptionError
 */
export class SubscriptionNotFoundError extends SubscriptionError {
    public constructor() {
        super('Subscription not found');
        this.name = 'SubscriptionNotFoundError';
    }
}
