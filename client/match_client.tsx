import Team, { mapToTeam } from '@/model/Team';
import axios from 'axios';
import Match, { mapToMatch } from '@/model/Match';

const API_URL = 'https://lol.fandom.com/api.php';

export async function fetchMatch(matchId: string): Promise<Match> {

  const params = {
    action: 'cargoquery',
    format: 'json',
    origin: '*', // Required for CORS
    limit: 3,
    tables: 'MatchSchedule=M, Tournaments=T',
    fields: 'M.MatchId, M.Tab, M.Team1, M.Team2, M.Winner, M.Team1Score, M.Team2Score, M.MatchDay, M.DateTime_UTC, M.OverviewPage, T.Name=Tournament',
    join_on: 'M.OverviewPage=T.OverviewPage',
    where: `M.MatchId LIKE "${matchId}"`,
  };

  try {
    // Perform the API request
    const response = await axios.get(API_URL, { params });
    // Convert the team map to an array
    console.log('API Response Latest Matches:', response.data);

    const match: Match = mapToMatch(response.data.cargoquery.title) || null;
    return match;
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    throw error;
  }
}