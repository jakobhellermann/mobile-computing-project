import { UpcomingEvent } from 'shared';
import { UpcomingEventRow } from '../database/rows';
/**
 * Convert upcoming event row to model
 * @param row - upcoming event row.
 * @returns UpcomingEvent.
 */
export function toUpcomingEvent(row: UpcomingEventRow): UpcomingEvent {
    let { timestamp, has_notified_start, ...rest } = row;
    return {
        ...rest,
        has_notified_start: has_notified_start ?? false,
        timestamp: new Date(timestamp).toISOString(),
    };
}
