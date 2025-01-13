export default interface Tournament {
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
  }
  
  // Example Function to Map API Response to Tournament Object
  export function mapToTournament(apiResponse: any): Tournament {
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