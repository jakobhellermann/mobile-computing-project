/**
 * Error thrown when something is not found
 */
export class ApiNotFoundError extends Error {
    public constructor(entity: string) {
        super(`Could not find '${entity}'`);
    }
}

/**
 * Error thrown when something is not found
 */
export class LeagueCargoError extends Error {
    public constructor(message: string) {
        super(`Could not execute cargo query: '${message}'`);
    }
}