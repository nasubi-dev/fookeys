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
  special?: () => void;
};
type Deck = Card[];
type Hand = Card[];

type Character = {
  name: string;
  description: string;
  image: string;
  company: string;
  action: () => void;
};

type Gift = {
  name: string;
  description: string;
  image: string;
  action: () => void;
};

type Mission = {
  name: string;
  description: string;
  action: () => void;
};

type MatchStatus = "matching" | "nothing" | "waiting";
type PlayerData = {
  id: string;
  idEnemy: string;
  idGame: string;
  name: string;
  sign: 0 | 1;
  match: MatchStatus;
  character: number;
  gift: number;
  check: boolean;
  hand: Card[];
  board: Card[];
  status: { hp: number; hungry: number; contribution: number; priority: number };
}

type GameData = {
  turn: number;
  players: string[];
  missions:Mission[];
};

export type {
  Card,
  Deck,
  Hand,
  Character,
  Gift,
  Mission,
  MatchStatus,
  PlayerData,
  GameData,
};
