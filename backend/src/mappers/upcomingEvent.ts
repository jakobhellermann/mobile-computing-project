import { UpcomingEvent } from 'shared';
import { UpcomingEventRow } from '../database/rows';
/**
 * Convert upcoming event row to model
 * @param row - upcoming event row.
 * @returns UpcomingEvent.
 */
export function toUpcomingEvent(row: UpcomingEventRow): UpcomingEvent {
    let { timestamp, ...rest } = row;
    return {
        ...rest,
        timestamp: new Date(timestamp).toISOString(),
    };
}
