type Card = {
  id: number;//?並び替え用?
  name: string;//名前
  waste: number;//消費期限
  hungry: number;//満腹値
  company: string;//会社名
  description: string;//説明文
  priority: number;//優先度
  atk?: number;//マッスル
  def?: number;//ディフェンス
  tech?: number;//テクニック
  heal?: number;//回復
  rotten?: boolean;//腐ってるかのフラグ
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
//!使われてるか調べる
type Phase = "shop" | "battle" | "result" | "none";
type MatchStatus = "matching" | "nothing" | "waiting" | "battle";
type PlayerSign = 0 | 1;
type Status = { hp: number; hungry: number; contribution: number };
type SumCards = { waste: number; hungry: number; priority: number; atk: number; def: number; tech: number };
type PlayerData = {
  idEnemy: string;
  idGame: string;
  name: string;
  check: boolean;
  donate: boolean;
  match: MatchStatus;
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
  firstAtkPlayer: PlayerSign | undefined;
};

export type { Card, Character, Gift, Mission, Phase, MatchStatus, PlayerSign, Status, PlayerData, SumCards, GameData };
