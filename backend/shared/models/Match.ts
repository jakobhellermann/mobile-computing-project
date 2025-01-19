export type Match = {
  matchId: string;          // Unique identifier for the match
  tab: string;              // Round of the tournament
  team1: string;            // Name of the first team
  team2: string;            // Name of the second team
  winner: string;           // Name of the winning team
  team1Score?: number;      // Points scored by Team1
  team2Score?: number;      // Points scored by Team2
  matchDay: number;         // The match day (e.g., 1, 2, 3)
  dateTimeUTC: string;      // Date and time in UTC format
  bestOf: string;           // Best of x games wins
  stream: string;           // Stream Link
  overviewPage: string;     // Tournament overview page
  tournament: string;       // Tournament Name
}

