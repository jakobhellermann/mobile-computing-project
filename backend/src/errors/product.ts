/**
 * Error thrown when a product is not found.
 * @extends Error
 */
export class ProductNotFoundError extends Error {
    public constructor(id: number) {
        super(`Product with id ${id} not found`);
    }
}
