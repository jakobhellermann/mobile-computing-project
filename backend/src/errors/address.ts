/**
 * Error thrown when an address is not found.
 * @extends Error
 */
export class AddressNotFoundError extends Error {
    public constructor() {
        super('Address not found');
    }
}
