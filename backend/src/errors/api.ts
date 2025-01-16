/**
 * Error thrown when something is not found
 */
export class ApiNotFoundError extends Error {
    public constructor(entity: string) {
        super(`Could not find '${entity}'`);
    }
}