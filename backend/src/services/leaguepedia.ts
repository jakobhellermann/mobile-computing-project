import axios from 'axios';
import { Match, Team, Tournament } from 'shared';
import Player from 'shared/models/Player';

const API_URL = 'https://lol.fandom.com/api.php';

export default class LeagueService {

    // #region Matches
    public async fetchMatch(matchId: string): Promise<Match> {

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
    // #endregion

    // #region Tournaments

    /**
     * Fetch tournament data from the Tournaments table.
     * @returns {Promise<Tournament[]>} 
     */
    public async fetchTournamentData(name: string): Promise<Tournament[]> {
        // Construct the CargoQuery API request
        console.log('Search Param:', name);
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
            console.log('API Response:', response.data);
            const tournaments: Tournament[] = response.data.cargoquery?.map((item: any) =>
                mapToTournament(item.title)
            ) || [];

            return tournaments;
        } catch (error) {
            console.error('Error fetching tournament data:', error);
            throw error;
        }
    }


    public async fetchTournamentLogo(team: string, filename: string): Promise<any> {
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

    public async fetchTournamentTeams(overviewpage: string): Promise<Team[]> {
        // Construct the CargoQuery API request
        //let tournamentFields = 'T.Name,T.DateStart,T.Date,T.Region,T.League,T.Prizepool,T.OverviewPage,T.Organizers,T.Rulebook,T.EventType,T.Region,T.Country'
        //let TeamFields = 'P.Team, P.Player, P.TeamOrder, P.OverviewPage'


        const params = {
            action: 'cargoquery',
            format: 'json',
            origin: '*', // Required for CORS
            tables: 'TournamentPlayers',
            limit: 500,
            fields: 'Team, Player, TeamOrder, OverviewPage, Role',
            where: `OverviewPage LIKE "%${overviewpage}%"`,
        };

        try {
            // Perform the API request
            const response = await axios.get(API_URL, { params });
            // Convert the team map to an array
            return mapToTournamentTeam(response);
        } catch (error) {
            console.error('Error fetching tournament data:', error);
            throw error;
        }
    }

    public async fetchTournamentMatches(overviewpage: string): Promise<Match[]> {
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


    // #endregion

    // #region Teams

    public async fetchTeamData(teamname: string): Promise<Team> {

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

    public async fetchLatestTeamMatches(team: string): Promise<Match[]> {

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
            ) ?? [];
            return matches;
        } catch (error) {
            console.error('Error fetching tournament data:', error);
            throw error;
        }
    }

    public async fetchUpcomingTeamMatches(team: string): Promise<Match[]> {
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
    };

    // #endregion

    // #region Images
    public async fetchApiImage(filename: string): Promise<any> {
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
    };
    // #endregion
}

function mapToTournament(apiResponse: any): Tournament {
    return {
        name: apiResponse.Name,
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
        overviewPage: apiResponse.OverviewPage,
        tournament: apiResponse.Tournament || apiResponse.OverviewPage
    };
}


const ROLE_PRIORITY: Record<string, number> = {
    Top: 1,
    Jungle: 2,
    Mid: 3,
    Bot: 4,
    Support: 5,
    Coach: 6,
    // Any other roles default to a higher number (lower priority)
};

export function mapToTournamentTeam(apiResponse: any): Team[] {

    const rawTeams = apiResponse.data.cargoquery || [];

    // Group players by team
    const teamMap: Record<string, Team> = {};

    rawTeams.forEach((item: any) => {
        const { Team: teamName, Player: playerName, Role: playerRole, OverviewPage: overviewPage } = item.title;

        // If the team doesn't exist in the map, create an entry
        if (!teamMap[teamName]) {
            teamMap[teamName] = {
                name: teamName,
                players: [],
                overviewPage,
            };
        }

        // Add the player to the team
        teamMap[teamName].players.push({
            id: "",
            name: "",
            playerName: playerName,
            role: playerRole
        });
    });
    const teams = Object.values(teamMap);

    // Sort players by role for each team
    teams.forEach((team) => {
        team.players = sortPlayersByRole(team.players);
    });

    return teams;

}

export function mapToTeam(apiResponse: any): Team {
    const rawTeams = apiResponse.data.cargoquery || [];

    // Group players by team
    const teamMap: Record<string, Team> = {};

    'ID, Name, Player, Team, Role, OverviewPage';

    rawTeams.forEach((item: any) => {
        const { ID: playerID, Name: name, Player: playerName, Team: teamName, Role: playerRole, OverviewPage: overviewPage } = item.title;

        // If the team doesn't exist in the map, create an entry
        if (!teamMap[teamName]) {
            teamMap[teamName] = {
                name: teamName,
                players: [],
                overviewPage,
            };
        }

        // Add the player to the team
        teamMap[teamName].players.push({
            id: playerID,
            name: name,
            playerName: playerName,
            role: playerRole
        });
    });
    const teams = Object.values(teamMap);

    // Sort players by role for each team
    teams.forEach((team) => {
        team.players = sortPlayersByRole(team.players);
    });

    return teams[0];

}

function sortPlayersByRole(players: Player[]): Player[] {
    return players.sort((a, b) => {
        const roleA = ROLE_PRIORITY[a.role] ?? 99;
        const roleB = ROLE_PRIORITY[b.role] ?? 99;
        return roleA - roleB;
    });
}
