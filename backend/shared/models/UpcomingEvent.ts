export type UpcomingEvent = {
    matchId: string;

    tournament: string;
    tournamentName: string;
    tab: string;
    team1: string;
    team2: string;

    has_notified_start: boolean;

    timestamp: string;
};