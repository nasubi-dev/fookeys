interface User {
  name: string;
  match: -1 | 0 | 1;
}

interface Card {
  name: string;
  waste: number;
  hungry: number;
  atk?: number;
  def?: number;
  matk?: number;
  mdef?: number;
  special?: () => void;
}

type Deck = Card[];

interface Player {
  name: string;
  id: string;
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

interface Game {
  turn: number;
  players: {
    player1: Player;
    player2: Player;
  };
}
