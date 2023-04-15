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
  enemyID: string;
  name: string;
  match: MatchStatus;
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

//-1 = 対戦中, 0 = マッチング待機中, 1 = 対戦終了
export type MatchStatus = -1 | 0 | 1;

export interface Game {
  turn: number;
  players: { player1: Player; player2: Player };
}
