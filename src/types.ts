type Card = {
  id: number;
  name: string;
  waste: number;
  hungry: number;
  company: string;
  description: string;
  priority: number;
  pow?: number;
  def?: number;
  tech?: number;
  // special?: () => void;
};

type Character = {
  name: string;
  description: string;
  company: string;
  // action?: () => void;
};

type Gift = {
  name: string;
  description: string;
  // action?: () => void;
};

type Mission = {
  name: string;
  description: string;
  // action?: () => void;
};

type MatchStatus = "matching" | "nothing" | "waiting" | "battle";
type PlayerSign = 0 | 1;
type Status = { hp: number; hungry: number; contribution: number; priority: number };
type SumCards = { waste: number; hungry: number; priority: number; pow: number; def: number; tech: number };
type PlayerData = {
  idEnemy: string;
  idGame: string;
  name: string;
  match: MatchStatus;
  check: boolean;
  sign: PlayerSign;
  character: Character;
  gift: Gift[];
  hand: Card[];
  field: Card[];
  status: Status;
  sumFields: SumCards;
};

type GameData = {
  turn: number;
  players: string[];
  missions: Mission[];
  firstAtkPlayer: PlayerSign;
};

export type { Card, Character, Gift, Mission, MatchStatus, PlayerSign, Status, PlayerData, SumCards, GameData };
