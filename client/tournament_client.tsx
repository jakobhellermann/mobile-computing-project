import axios from 'axios';

const API_URL = 'https://lol.fandom.com/api.php';

export async function fetchTournamentLogo(team: string, filename: string): Promise<string> {
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

export async function fetchTournamentTest(name: string): Promise<Tournament> {
  // Construct the CargoQuery API request
  console.log('Search Param:', name);
        const params = {
            action: 'cargoquery',
            format: 'json',
            origin: '*', // Required for CORS
            tables: 'Tournaments',
            fields: 'Name,DateStart,Date,Region,League,Prizepool,OverviewPage,Organizers,Rulebook,EventType,Region,Country',
            where: `OverviewPage LIKE "${name}"`,
        };

        try {
            // Perform the API request
            const response = await axios.get(API_URL, { params });

            // Parse and map the results to the Tournament interface
            console.log('API Response:', response.data);
            const tournaments: Tournament[] = response.data.cargoquery?.map((item: any) =>
                mapToTournament(item.title)
            ) || [];

            if (tournaments.length != 1) {
                throw new Error(`Expected to get 1 match for ${name}, fround ${tournaments.length}`);
            }

            return tournaments[0];
        } catch (error) {
            console.error('Error fetching tournament data:', error);
            throw error;
        }
}

export async function fetchMatchTest(matchId: string): Promise<Match> {

  const params = {
      action: 'cargoquery',
      format: 'json',
      origin: '*', // Required for CORS
      limit: 3,
      tables: 'MatchSchedule=M, Tournaments=T',
      fields: 'M.MatchId, M.Tab, M.Team1, M.Team2, M.Winner, M.Team1Score, M.Team2Score, M.MatchDay, M.DateTime_UTC, M.OverviewPage, M.BestOf, M.Stream, T.Name=Tournament',
      join_on: 'M.OverviewPage=T.OverviewPage',
      where: `M.MatchId LIKE "${matchId}"`,
  };

  try {
      // Perform the API request
      const response = await axios.get(API_URL, { params });
      // Convert the team map to an array
      console.log('API Response Latest Matches:', response.data);

      const matches: Match[] = response.data.cargoquery.map((res: any) => mapToMatch(res.title));
      if (matches.length != 1) {
          throw new Error(`Expected to get 1 match for ${matchId}, fround ${matches.length}`);
      }
      return matches[0];
  } catch (error) {
      console.error('Error fetching tournament data:', error);
      throw error;
  }
}

export async function fetchMatchRosterTest(overviewpage: string, team: string): Promise<string[]> {
  // Construct the CargoQuery API request

        const params = {
          action: 'cargoquery',
          format: 'json',
          origin: '*', // Required for CORS
          tables: 'TournamentPlayers',
          limit: 500,
          fields: 'Team, Player, TeamOrder, N_PlayerInTeam, OverviewPage, Role',
          where: `OverviewPage LIKE "${overviewpage}" AND Team Like "${team}"`,
      };

      try {
        const response = await axios.get(API_URL, { params });
        const players = response.data.cargoquery.map((item: any) => item.title);

        // Filter and organize players by role
        const roles = ["Top", "Jungle", "Mid", "Bot", "Support"];
        const roster: string[] = [];

        for (const role of roles) {
            const playersByRole = players.filter((player: any) => player.Role === role);
            if (playersByRole.length > 0) {
                const firstPlayer = playersByRole.reduce((prev: any, curr: any) => {
                    return Number(prev.N_PlayerInTeam) < Number(curr.N_PlayerInTeam) ? prev : curr;
                });
                roster.push(firstPlayer.Player.split("(")[0]);
            } else {
                roster.push("");
            }
        }

        console.log("FinalRoster:", roster)
        return roster;
      } catch (error) {
      console.error('Error fetching tournament data:', error);
      throw error;
      }
}

export async function fetchUpcomingTeamMatchesTest(team: string): Promise<Match[]> {
  const params = {
      action: 'cargoquery',
      format: 'json',
      origin: '*', // Required for CORS
      limit: 3,
      tables: 'MatchSchedule=M, Tournaments=T',
      fields: 'M.MatchId, M.Tab, M.Team1, M.Team2, M.Winner, M.Team1Score, M.Team2Score, M.MatchDay, M.DateTime_UTC, M.OverviewPage, T.Name=Tournament',
      join_on: 'M.OverviewPage=T.OverviewPage',
      where: `(M.Team1 LIKE "%${team}%" OR M.Team2 LIKE "%${team}%") AND M.Winner IS NULL AND M.DateTime_UTC IS NOT NULL AND M.DateTime_UTC >= '${getCurrentTime()}'`,
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
};

function mapToTournament(apiResponse: any): Tournament {
    return {
        name: apiResponse.Name ? unescapeHTML(apiResponse.Name) : apiResponse.Name,
        eventType: apiResponse.EventType,
        dateStart: apiResponse.DateStart,
        dateEnd: apiResponse.Date,
        country: apiResponse.Country,
        region: apiResponse.Region,
        league: apiResponse.League,
        prizepool: apiResponse.Prizepool,
        organizers: apiResponse.Organizers,
        rulebook: apiResponse.Rulebook,
        overviewPage: apiResponse.OverviewPage,
    };
}

function unescapeHTML(str: string) {
  return str.replace(/\&([^;]+);/g, (entity: string, entityCode: string) => {
      var match;

      if (entityCode in htmlEntities) {
          return htmlEntities[entityCode];
      } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
      } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
      } else {
          return entity;
      }
  });
};

const htmlEntities: Record<string, string> = {
  nbsp: ' ',
  cent: '¢',
  pound: '£',
  yen: '¥',
  euro: '€',
  copy: '©',
  reg: '®',
  lt: '<',
  gt: '>',
  quot: '"',
  amp: '&',
  apos: '\''
};

export type Tournament = {
  name: string;
  eventType: string;
  dateStart: string;
  dateEnd: string;
  country: string;
  region: string;
  league: string;
  prizepool: string;
  organizers: string;
  rulebook: string;
  overviewPage: string;
};

export type Match = {
  matchId: string;          // Unique identifier for the match
  tab: string;
  team1: string;            // Name of the first team
  team2: string;            // Name of the second team
  winner: string;           // Name of the winning team
  team1Score?: number;      // Points scored by Team1
  team2Score?: number;      // Points scored by Team2
  matchDay: number;         // The match day (e.g., 1, 2, 3)
  dateTimeUTC: string;      // Date and time in UTC format
  overviewPage: string;     // URL or reference to the match overview page
  bestOf: string;
  stream: string;
  tournament: string;
}

function mapToMatch(apiResponse: any): Match {
  return {
      matchId: apiResponse.MatchId,
      tab: apiResponse.Tab,
      team1: apiResponse.Team1,
      team2: apiResponse.Team2,
      winner: apiResponse.Winner,
      team1Score: parseInt(apiResponse.Team1Score), // Convert to number
      team2Score: parseInt(apiResponse.Team2Score), // Convert to number
      matchDay: parseInt(apiResponse.MatchDay), // Convert to number
      dateTimeUTC: apiResponse['DateTime UTC'],
      bestOf: apiResponse.BestOf,
      stream: apiResponse.Stream || "TBD",
      overviewPage: apiResponse.OverviewPage,
      tournament: apiResponse.Tournament || apiResponse.OverviewPage
  };
}

function getCurrentTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}