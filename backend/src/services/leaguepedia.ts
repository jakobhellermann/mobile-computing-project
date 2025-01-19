import axios from 'axios';
import { Tournament, Match, Team, Player } from 'shared';
import { ApiNotFoundError, LeagueCargoError } from '../errors/api';

const API_URL = 'https://lol.fandom.com/api.php';

export default class LeagueService {

    // #region Matches

    /**
     * Fetch a Match by matchId
     * @param matchId 
     * @returns 
     */
    public async fetchMatch(matchId: string): Promise<Match> {
        const response = await cargoQuery<any>({
            limit: 3,
            tables: 'MatchSchedule=M, Tournaments=T',
            fields: 'M.MatchId, M.Tab, M.Team1, M.Team2, M.Winner, M.Team1Score, M.Team2Score, M.MatchDay, M.DateTime_UTC, M.OverviewPage, M.BestOf, M.Stream, T.Name=Tournament',
            join_on: 'M.OverviewPage=T.OverviewPage',
            where: `M.MatchId LIKE "${matchId}"`,
        });

        let matches = response.map(mapToMatch);
        if (matches.length !== 1) {
            throw new Error(`Expected to get 1 match for ${matchId}, fround ${matches.length}`);
        }
        return matches[0];
    }

    /**
     * Fetch a Match Roster by the Tournament overviewPage and the team
     * @param overviewPage 
     * @param team 
     * @returns 
     */
    public async fetchMatchRoster(overviewPage: string, team: string): Promise<string[]> {
        const response = await cargoQuery<any>({
            limit: 50,
            tables: 'TournamentPlayers',
            fields: 'Team, Player, TeamOrder, N_PlayerInTeam, OverviewPage, Role',
            where: `OverviewPage LIKE "${overviewPage}" AND Team Like "${team}"`,

        });

        // Filter and organize players by role
        const roles = ["Top", "Jungle", "Mid", "Bot", "Support"];
        const roster: string[] = [];

        for (const role of roles) {
            const playersByRole = response.filter((player: any) => player.Role === role);
            if (playersByRole.length > 0) {
                const firstPlayer = playersByRole.reduce((prev: any, curr: any) => {
                    return Number(prev.N_PlayerInTeam) < Number(curr.N_PlayerInTeam) ? prev : curr;
                });
                roster.push(firstPlayer.Player.split("(")[0]);
            } else {
                roster.push("");
            }
        }


        return roster;
    };

    /**
     * Fetch Head-to-Head Matches of 2 Teams
     * @param team1 
     * @param team2 
     * @returns 
     */
    public async fetchHtHMatches(team1: string, team2: string): Promise<Match[]> {
        const response = await cargoQuery({
            limit: 50,
            tables: 'MatchSchedule=M, Tournaments=T',
            fields: 'M.MatchId, M.Tab, M.Team1, M.Team2, M.Winner, M.Team1Score, M.Team2Score, M.MatchDay, M.DateTime_UTC, M.OverviewPage, M.BestOf, M.Stream, T.Name=Tournament',
            join_on: 'M.OverviewPage=T.OverviewPage',
            where: `(M.Team1 LIKE "%${team1}%" AND M.Team2 LIKE "%${team2}%") OR (M.Team1 LIKE "%${team2}%" AND M.Team2 LIKE "%${team1}%") AND M.Winner IS NOT NULL`,
            order_by: 'DateTime_UTC desc',
        });
        return response.map(mapToMatch);
    };
    // #endregion

    // #region Tournaments

    /**
     * Fetch Tournaments by Tournament name
     * @param name 
     * @returns {Promise<Tournament[]>}
     */
    public async fetchTournamentSearch(name: string): Promise<Tournament[]> {
        const response = await cargoQuery({
            tables: 'Tournaments',
            fields: 'Name,DateStart,Date,Region,League,Prizepool,OverviewPage,Organizers,Rulebook,EventType,Region,Country',
            where: `Name LIKE "%${name}%"`,
        });
        return response.map(mapToTournament);
    }

    /**
 * Fetch tournament data from the Tournaments table.
 * @param name -> overviewPage
 * @returns {Promise<Tournament>} 
 */
    public async fetchTournamentData(name: string): Promise<Tournament> {
        const response = await cargoQuery({
            tables: 'Tournaments',
            fields: 'Name,DateStart,Date,Region,League,Prizepool,OverviewPage,Organizers,Rulebook,EventType,Region,Country',
            where: `OverviewPage LIKE "${name}"`,
        });
        const tournaments = response.map(mapToTournament);
        if (tournaments.length !== 1) {
            throw new Error(`Expected to get 1 match for ${name}, fround ${tournaments.length}`);
        }

        return tournaments[0];
    }


    /**
     * Fetch a Logo Image
     * @param team 
     * @param filename 
     * @returns {Promise<any>}
     */
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

    /**
     * Fetch all Teams participating in the a tournament
     * @param overviewpage 
     * @returns {Promise<Team[]>}
     */
    public async fetchTournamentTeams(overviewpage: string): Promise<Team[]> {
        // Construct the CargoQuery API request
        //let tournamentFields = 'T.Name,T.DateStart,T.Date,T.Region,T.League,T.Prizepool,T.OverviewPage,T.Organizers,T.Rulebook,T.EventType,T.Region,T.Country'
        //let TeamFields = 'P.Team, P.Player, P.TeamOrder, P.OverviewPage'


        const response = await cargoQuery({
            tables: 'TournamentPlayers',
            limit: 500,
            fields: 'Team, Player, TeamOrder, OverviewPage, Role',
            where: `OverviewPage LIKE "%${overviewpage}%"`,
        });
        return mapToTournamentTeam(response);
    }

    public async fetchTournamentMatches(overviewpage: string): Promise<Match[]> {
        const response = await cargoQuery({
            tables: 'MatchSchedule',
            fields: 'MatchId, Tab, Team1, Team2, Winner, Team1Score, Team2Score, MatchDay, DateTime_UTC, OverviewPage, BestOf, Stream',
            where: `OverviewPage LIKE "%${overviewpage}%"`,
        });
        return response.map(mapToMatch);
    }

    // #endregion

    // #region Teams

    /**
     * Fetch Team Data by the Team Name
     * @param teamname 
     * @returns {Promise<Team>}
     */
    public async fetchTeamData(teamname: string): Promise<Team> {
        const response = await cargoQuery({
            tables: 'Players',
            fields: 'ID, Name, Player, Team, Role, OverviewPage',
            where: `TEAM LIKE "${teamname}"`,
        });
        const team = mapToTeam(response);
        if (!team) {
            throw new ApiNotFoundError(teamname);
        }
        return team;
    }

    /**
     * Fetch the latest Matches(Results) of a team
     * @param team 
     * @returns {Promise<Match[]>}
     */
    public async fetchLatestTeamMatches(team: string): Promise<Match[]> {
        const response = await cargoQuery({
            limit: 3,
            tables: 'MatchSchedule=M, Tournaments=T',
            fields: 'M.MatchId, M.Tab, M.Team1, M.Team2, M.Winner, M.Team1Score, M.Team2Score, M.MatchDay, M.DateTime_UTC, M.OverviewPage, M.BestOf, M.Stream, T.Name=Tournament',
            join_on: 'M.OverviewPage=T.OverviewPage',
            where: `(M.Team1 LIKE "%${team}%" OR M.Team2 LIKE "%${team}%") AND M.Winner IS NOT NULL`,
            order_by: 'DateTime_UTC desc',
        });
        return response.map(mapToMatch);
    }

    /**
     * Fetch upcoming Matches of a team
     * @param team 
     * @returns {Promise<Match[]>}
     */
    public async fetchUpcomingTeamMatches(team: string): Promise<Match[]> {
        const response = await cargoQuery({
            limit: 3,
            tables: 'MatchSchedule=M, Tournaments=T',
            fields: 'M.MatchId, M.Tab, M.Team1, M.Team2, M.Winner, M.Team1Score, M.Team2Score, M.MatchDay, M.DateTime_UTC, M.OverviewPage, M.BestOf, M.Stream, T.Name=Tournament',
            join_on: 'M.OverviewPage=T.OverviewPage',
            where: `(M.Team1 LIKE "%${team}%" OR M.Team2 LIKE "%${team}%") AND M.Winner IS NULL AND M.DateTime_UTC IS NOT NULL AND M.DateTime_UTC >= '${getCurrentTime()}'`,
            order_by: 'DateTime_UTC asc',
        });
        return response.map(mapToMatch);
    };

    /**
     * Search Teams by name
     * @param name 
     * @returns {Promise<string[]>}
     */
    public async fetchTeamSearch(name: string): Promise<string[]> {
        console.log('Search Param:', name);
        const response = await cargoQuery<{ Name: string; }>({
            tables: 'Teams',
            fields: 'Name, IsDisbanded',
            where: `Name LIKE "%${name}%" AND IsDisbanded = 0`,
        });
        return response.map(item => item.Name);
    }

    // #endregion

    // #region Images

    /**
     * Fetch an Image from the API
     * @param filename 
     * @returns {Promise<any>}
     */
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

type CargoParams = {
    limit?: number,
    tables?: string;
    fields?: string;
    join_on?: string;
    where?: string;
    order_by?: string;
};

type CargoResponse<T> = {
    cargoquery: { title: T; }[];
    error: undefined;
} | {
    error: {
        code: string;
        info: string;
        errorclass: string;
    };
};
/**
 * Builds the query and sends the request
 * @param data 
 * @returns {Promise<T[]>}
 */
export async function cargoQuery<T = unknown>(data: CargoParams): Promise<T[]> {
    const params = {
        action: 'cargoquery',
        format: 'json',
        origin: '*',
        ...data,
    };

    try {
        const response = await axios.get<CargoResponse<T>>(API_URL, { params });
        if (response.data.error) {
            throw new LeagueCargoError(response.data.error.code);
        }
        return response.data.cargoquery.map((item) => item.title);
    } catch (error) {
        console.error('Error fetching cargo query:', error);
        throw error;
    }
}

/**
 * Maps the apiResponse to a Tournament
 * @param apiResponse 
 * @returns {Tournament}
 */
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

/**
 * Maps the apiResponse to a Match
 * @param apiResponse 
 * @returns {Match}
 */
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

/**
 * Role Priority for display
 */
const ROLE_PRIORITY: Record<string, number> = {
    Top: 1,
    Jungle: 2,
    Mid: 3,
    Bot: 4,
    Support: 5,
    Coach: 6,
    // Any other roles default to a higher number (lower priority)
};

/**
 * Maps the apiResponse to a Team for the Tournament Page
 * @param rawTeams 
 * @returns {Team[]}
 */
export function mapToTournamentTeam(rawTeams: any[]): Team[] {

    // Group players by team
    const teamMap: Record<string, Team> = {};

    rawTeams.forEach((item: any) => {
        const { Team: teamName, Player: playerName, Role: playerRole, OverviewPage: overviewPage } = item;

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
/**
 * Maps the apiResponse to a Team for the Team Page
 * @param rawTeams 
 * @returns {Team[]}
 */
export function mapToTeam(rawTeams: any[]): Team | undefined {
    // Group players by team
    const teamMap: Record<string, Team> = {};

    // 'ID, Name, Player, Team, Role, OverviewPage';
    rawTeams.forEach((item: any) => {
        const { ID: playerID, Name: name, Player: playerName, Team: teamName, Role: playerRole, OverviewPage: overviewPage } = item;

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


/**
 * Sorts Players by the ROLE_PRIORITY
 * @param players 
 * @returns {Player[]}
 */
function sortPlayersByRole(players: Player[]): Player[] {
    return players.sort((a, b) => {
        const roleA = ROLE_PRIORITY[a.role] ?? 99;
        const roleB = ROLE_PRIORITY[b.role] ?? 99;
        return roleA - roleB;
    });
}

// https://stackoverflow.com/a/39243641
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

export function getCurrentTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
