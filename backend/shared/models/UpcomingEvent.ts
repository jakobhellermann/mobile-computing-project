export type UpcomingEvent = {
    matchId: string;

    tournament: string;
    tournamentName: string;
    team1: string;
    team2: string;

    has_notified_start: boolean;

    timestamp: string;
};