export default interface Match {
    matchId: string;          // Unique identifier for the match
    tab: string;
    team1: string;            // Name of the first team
    team2: string;            // Name of the second team
    winner: string;           // Name of the winning team
    team1Score: number;      // Points scored by Team1
    team2Score: number;      // Points scored by Team2
    matchDay: number;         // The match day (e.g., 1, 2, 3)
    dateTimeUTC: string;      // Date and time in UTC format
    overviewPage: string;     // URL or reference to the match overview page
    tournament:string;
  }

  export function mapToMatch(apiResponse: any): Match {
    return {
      matchId: apiResponse.MatchId,
      tab: apiResponse.Tab,
      team1: apiResponse.Team1,
      team2: apiResponse.Team2,
      winner: apiResponse.Winner,
      team1Score: parseInt(apiResponse.Team1Score), // Convert to number
      team2Score: parseInt(apiResponse.Team2Score), // Convert to number
      matchDay: parseInt(apiResponse.MatchDay),      // Convert to number
      dateTimeUTC: apiResponse.DateTime_UTC,
      overviewPage: apiResponse.OverviewPage,
      tournament: apiResponse.Tournament || apiResponse.OverviewPage
    };
  }