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

//-1 = 対戦中, 0 = マッチング待機中, 1 = 対戦終了
type MatchStatus = -1 | 0 | 1;
type PlayerData = {
  id: string;
  name: string;
  match: MatchStatus;
  character: number;
  gift: number;
  idEnemy: string;
  idGame: string;
};
interface Player {
  id: string;
  idEnemy: string;
  idGame: string;
  name: string;
  match: MatchStatus;
  character: number;
  gift: number;
  hand?: Card[];
  board?: Card[];
  status?: { hp: number; hungry: number; contribution: number; priority: number };
}

type Game = {
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
  Game,
};
