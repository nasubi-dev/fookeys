type Card = {
  id: number;
  name: string;
  waste: number;
  hungry: number;
  company: string;
  description: string;
  pow?: number;
  def?: number;
  tech?: number;
  // special?: () => void;
};
type Result = {
  pow: number;
  def: number;
  tech: number;
  waste: number;
  hungry: number;
};

type Character = {
  name: string;
  description: string;
  image: string;
  company: string;
  // action?: () => void;
};

type Gift = {
  name: string;
  description: string;
  image: string;
  // action?: () => void;
};

type Mission = {
  name: string;
  description: string;
  // action?: () => void;
};

type MatchStatus = "matching" | "nothing" | "waiting";
type PlayerSign = 0 | 1;
type Status = { hp: number; hungry: number; contribution: number; priority: number };
type PlayerData = {
  idEnemy: string;
  idGame: string;
  name: string;
  match: MatchStatus;
  check: boolean;
  sign: PlayerSign;
  character: Character | null;
  gift: [Gift, Gift, Gift];
  hand: Card[];
  field: Card[];
  status: Status;
};

type GameData = {
  turn: number;
  players: string[];
  missions: Mission[];
  resultEnemy: Result;
};

export type { Card, Result, Character, Gift, Mission, MatchStatus, PlayerSign, Status, PlayerData, GameData };
