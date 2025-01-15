import Team, { mapToTeam } from '@/model/Team';
import axios from 'axios';
import Match, {mapToMatch} from '@/model/Match';

const API_URL = 'https://lol.fandom.com/api.php';

export async function fetchTeamData(teamname: string): Promise<Team> {
  
    const params = {
      action: 'cargoquery',
      format: 'json',
      origin: '*', // Required for CORS
      tables: 'Players',
      fields: 'ID, Name, Player, Team, Role, OverviewPage',
      where: `TEAM LIKE "${teamname}"`,
    };
  
    try {
      // Perform the API request
      const response = await axios.get(API_URL, { params });
      console.log("Team Response:", response.data);
      // Convert the team map to an array
      return mapToTeam(response);
    } catch (error) {
      console.error('Error fetching tournament data:', error);
      throw error;
    }
  }

  export async function fetchLatestTeamMatches(team: string): Promise<Match[]> {

    const params = {
        action: 'cargoquery',
        format: 'json',
        origin: '*', // Required for CORS
        limit: 3,
        tables: 'MatchSchedule=M, Tournaments=T',
        fields: 'M.MatchId, M.Tab, M.Team1, M.Team2, M.Winner, M.Team1Score, M.Team2Score, M.MatchDay, M.DateTime_UTC, M.OverviewPage, T.Name=Tournament',
        join_on: 'M.OverviewPage=T.OverviewPage',
        where: `(M.Team1 LIKE "%${team}%" OR M.Team2 LIKE "%${team}%") AND M.Winner IS NOT NULL`,
        order_by: 'DateTime_UTC desc',
      };
  
    try {
      // Perform the API request
      const response = await axios.get(API_URL, { params });
      // Convert the team map to an array
      console.log('API Response Latest Matches:', response.data);
  
      const matches: Match[] = response.data.cargoquery?.map((item: any) =>
        mapToMatch(item.title)
      ) || [];
      return matches;
    } catch (error) {
      console.error('Error fetching tournament data:', error);
      throw error;
    }
  }

  export async function fetchUpcomingTeamMatches(team: string): Promise<Match[]> {

    const params = {
      action: 'cargoquery',
      format: 'json',
      origin: '*', // Required for CORS
      limit: 3,
      tables: 'MatchSchedule=M, Tournaments=T',
      fields: 'M.MatchId, M.Tab, M.Team1, M.Team2, M.Winner, M.Team1Score, M.Team2Score, M.MatchDay, M.DateTime_UTC, M.OverviewPage, T.Name=Tournament',
      join_on: 'M.OverviewPage=T.OverviewPage',
      where: `(M.Team1 LIKE "%${team}%" OR M.Team2 LIKE "%${team}%") AND M.Winner IS NULL`,
      order_by: 'DateTime_UTC asc',
    };
  
    try {
      // Perform the API request
      const response = await axios.get(API_URL, { params });
      // Convert the team map to an array
      console.log('API Response Upcoming Matches:', response.data);
  
      const matches: Match[] = response.data.cargoquery?.map((item: any) =>
        mapToMatch(item.title)
      ) || [];
      return matches;
    } catch (error) {
      console.error('Error fetching tournament data:', error);
      throw error;
    }
  }
