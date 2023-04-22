type Card = {
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

type Character = {
  name: string;
  description: string;
  image: string;
  company: string;
  action: () => void;
};
type Characters = Character[];

type Gift = {
  name: string;
  description: string;
  image: string;
  action: () => void;
};
type Gifts = Gift[];

type Mission = {
  name: string;
  description: string;
  action: () => void;
};
type Missions = Mission[];

type MatchStatus = "matching" | "nothing" | "waiting";
//0 = player1, 1 = player2
type PlayerData = {
  id: string;
  num: 0 | 1;
  name: string;
  idEnemy: string;
  idGame: string;
  match: MatchStatus;
  character: number;
  gift: number;
};
interface Player {
  id: string;
  name: string;
  character: number;
  gift: number;
  check: boolean;
  hand: Card[];
  board: Card[];
  status: { hp: number; hungry: number; contribution: number; priority: number };
}

type GameData = {
  turn: number;
  players: [Player, Player];
};

export type {
  Card,
  Deck,
  Character,
  Characters,
  Gift,
  Gifts,
  Mission,
  Missions,
  MatchStatus,
  PlayerData,
  Player,
  GameData,
};
