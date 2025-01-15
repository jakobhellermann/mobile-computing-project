import { Match, Team, Tournament } from "shared";
import { apiFetch } from "./base";

export function searchTournaments(term: string): Promise<Tournament[]> {
    return apiFetch(`/league/tournament/search?term=${encodeURIComponent(term)}`);
}
export function fetchTournamentTeams(tournamentId: string): Promise<Team[]> {
    return apiFetch(`/league/tournament/${encodeURIComponent(tournamentId)}/teams`);
}
export function fetchTournamentMatches(tournamentId: string): Promise<Match[]> {
    return apiFetch(`/league/tournament/${encodeURIComponent(tournamentId)}/matches`);
}

export function fetchMatch(matchId: string): Promise<Match[]> {
    return apiFetch(`/league/match/${encodeURIComponent(matchId)}`);
}
export function fetchTeam(teamId: string): Promise<Team> {
    return apiFetch(`/league/team/${encodeURIComponent(teamId)}`);
}
export function fetchTeamLatestMatches(teamId: string): Promise<Match[]> {
    return apiFetch(`/league/team/${encodeURIComponent(teamId)}/matches/latest`);
}
export function fetchTeamUpcomingMatches(teamId: string): Promise<Match[]> {
    return apiFetch(`/league/team/${encodeURIComponent(teamId)}/matches/upcoming`);
}