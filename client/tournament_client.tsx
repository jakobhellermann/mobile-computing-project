import Tournament, { mapToTournament } from '@/model/Tournament';
import Team, { mapToTeam } from '@/model/Team';
import axios from 'axios';
import { Image } from 'react-native';
import Match, {mapToMatch} from '@/model/Match';

const API_URL = 'https://lol.fandom.com/api.php';

/**
 * Fetch tournament data from the Tournaments table.
 * @returns {Promise<Tournament[]>} 
 */
export async function fetchTournamentData(name: string): Promise<Tournament[]> {
  // Construct the CargoQuery API request
  const params = {
    action: 'cargoquery',
    format: 'json',
    origin: '*', // Required for CORS
    tables: 'Tournaments',
    fields: 'Name,DateStart,Date,Region,League,Prizepool,OverviewPage,Organizers,Rulebook,EventType,Region,Country',
    where: `Name LIKE "%${name}%"`,
  };

  try {
    // Perform the API request
    const response = await axios.get(API_URL, { params });

    // Parse and map the results to the Tournament interface
    //console.log('API Response:', response.data);
    const tournaments: Tournament[] = response.data.cargoquery?.map((item: any) =>
      mapToTournament(item.title)
    ) || [];

    return tournaments;
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    throw error;
  }
}

export async function fetchTournamentLogo(team: string, filename: string): Promise<any> {
  // Construct the CargoQuery API request
  const params = {
        action: 'query',
        format: 'json',
        origin: '*',
        titles: `File:${filename}`,
        prop: 'imageinfo',
        iiprop: "url",
  };

  try {
    // Perform the API request
    const response = await axios.get(API_URL, { params });

    // Parse and map the results to the Tournament interface
    //console.log('API Response:', response.data);
    const pages = response.data.query.pages;
    const firstPageKey = Object.keys(pages)[0];
    const resultImageURL = pages[firstPageKey]?.imageinfo?.[0].url; 
    //console.log('Image URL:', resultImageURL);
    let result = new URL(resultImageURL);
    result.search = "";
    return result.href.split(".png")[0].concat(".png");
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    throw error;
  }
}

export async function fetchTournamentTeams(overviewpage: string): Promise<Team[]> {
  // Construct the CargoQuery API request
  //let tournamentFields = 'T.Name,T.DateStart,T.Date,T.Region,T.League,T.Prizepool,T.OverviewPage,T.Organizers,T.Rulebook,T.EventType,T.Region,T.Country'
  //let TeamFields = 'P.Team, P.Player, P.TeamOrder, P.OverviewPage'
                    

  const params = {
    action: 'cargoquery',
    format: 'json',
    origin: '*', // Required for CORS
    tables: 'TournamentPlayers',
    fields: 'Team, Player, TeamOrder, OverviewPage, Role',
    where: `OverviewPage LIKE "%${overviewpage}%"`,
  };

  try {
    // Perform the API request
    const response = await axios.get(API_URL, { params });
    // Convert the team map to an array
    return mapToTeam(response);
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    throw error;
  }
}

export async function fetchTournamentMatches(overviewpage: string): Promise<Match[]> {
  // Construct the CargoQuery API request
  //let tournamentFields = 'T.Name,T.DateStart,T.Date,T.Region,T.League,T.Prizepool,T.OverviewPage,T.Organizers,T.Rulebook,T.EventType,T.Region,T.Country'
  //let TeamFields = 'P.Team, P.Player, P.TeamOrder, P.OverviewPage'
                    

  const params = {
    action: 'cargoquery',
    format: 'json',
    origin: '*', // Required for CORS
    tables: 'MatchSchedule',
    fields: 'MatchId, Tab, Team1, Team2, Winner, Team1Score, Team2Score, MatchDay, DateTime_UTC, OverviewPage',
    where: `OverviewPage LIKE "%${overviewpage}%"`,
  };

  try {
    // Perform the API request
    const response = await axios.get(API_URL, { params });
    // Convert the team map to an array
    console.log('API Response Matches:', response.data);

    const matches: Match[] = response.data.cargoquery?.map((item: any) =>
      mapToMatch(item.title)
    ) || [];
    return matches;
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    throw error;
  }
}





