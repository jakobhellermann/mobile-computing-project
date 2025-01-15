import { Match } from "./Match";
import { Team } from "./Team";

export interface Tournament {
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
  teams: Team[];
  matches: Match[];
}
