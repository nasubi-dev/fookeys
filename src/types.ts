export type Card = {
  name: string;
  waste: number;
  hungry: number;
  company: string;
  description: string;
  pow?: number;
  def?: number;
  tech?: number;
  special?: () => void;
}
export type Deck = Card[];

type Character = {
  name: string;
  description: string;
  image: string;
  company: string;
  action: () => void;
}
export type Characters= Character[];

type Gift = {
  name: string;
  description: string;
  image: string;
  action: () => void;
}
export type Gifts = Gift[];

type Mission = {
  name: string;
  description: string;
  action: () => void;
}
export type Missions = Mission[];


export interface Player {
  id: string;
  idEnemy: string;
  idGame: string;
  name: string;
  match: MatchStatus;
  character: number;
  gift: number;
  hand?: Card[];
  board?: Card[];
  status?: {
    hp: number;
    hungry: number;
    contribution: number;
    priority: number;
  };
}

//-1 = 対戦中, 0 = マッチング待機中, 1 = 対戦終了
export type MatchStatus = -1 | 0 | 1;

export type Game = {
  turn: number;
  players: [Player, Player];
}
