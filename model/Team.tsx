import Player from './Player';
export default interface Team {
    name: string;
    players: Player[]
    overviewPage: string;
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
  // Example Function to Map API Response to Tournament Object
  export function mapToTeam(apiResponse: any): Team[] {

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
          name: playerName,
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

function sortPlayersByRole(players: Player[]): Player[] {
    return players.sort((a, b) => {
      const roleA = ROLE_PRIORITY[a.role] || 99; 
      const roleB = ROLE_PRIORITY[b.role] || 99;
      return roleA - roleB;
    });
  }

