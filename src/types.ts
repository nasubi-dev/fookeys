export interface Card {
  name: string;
  waste: number;
  hungry: number;
  atk?: number;
  def?: number;
  matk?: number;
  mdef?: number;
  special?: () => void;
}

export type Deck = Card[];

export interface Player {
  id:string;
  enemyId: string;
  name: string;
  match: -1 | 0 | 1;
  character: number;
  gift: number;
  hand: Card[];
  board: Card[];
  status: {
    atk: number;
    def: number;
    hp: number;
    hungry: number;
    matk: number;
    mdef: number;
  };
}
export interface Game {
  turn: number;
  players: { player1: Player; player2: Player };
}
