import { Player } from './Player';

export type Team = {
  name: string;         //Team name
  players: Player[];    //Players of the Team
  overviewPage: string; //overviewPage of the Team
};
