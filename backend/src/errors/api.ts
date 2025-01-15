/**
 * Base class for all league API errors.
 */
export abstract class ApiError extends Error { }

/**
 * Error thrown when an order product is not found.
 * @extends OrderError
 */
export class ApiNotFoundError extends ApiError {
    public constructor(entity: string) {
        super(`Could not find '${entity}'`);
    }
}