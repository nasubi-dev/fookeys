type Card = {
  id: number; //?並び替え用?
  name: string; //名前
  waste: number; //消費期限
  hungry: number; //満腹値
  company: string; //会社名
  description: string; //説明文
  priority?: number; //優先度
  atk?: number; //マッスル
  def?: number; //ディフェンス
  tech?: number; //テクニック
  heal?: number; //回復
  rotten?: boolean; //腐ってるかのフラグ
  // special?: () => void;
};

type Character = {
  id: number;
  name: string;
  description: string;
  company: string;
  maxHungry?: number;
  maxHp?: number;
  initialContribution?: number;
  passive?: () => void;
};

type Timing = "before" | "after";
type Gift = {
  id: number;
  name: string;
  description: string;
  requireContribution: number;
  skill: (timing:Timing,id: string) => void;
};

type Mission = {
  id: number;
  name: string;
  description: string;
  reward: number;
  rank?: number;
  // action?: () => void;
};
//!使われてるか調べる
type Phase = "shop" | "battle" | "result" | "none";
type MatchStatus = "matching" | "nothing" | "waiting" | "battle";
type PlayerSign = 0 | 1;
type Status = { hp: number; hungry: number; contribution: number };
type SumCards = { waste: number; hungry: number; priority: number; atk: number; def: number; tech: number; heal: number };
type PlayerData = {
  idEnemy: string;
  idGame: string;
  name: string;
  check: boolean;
  donate: boolean;
  match: MatchStatus;
  character: number;
  gifts: number[];
  isSelectedGift: number | undefined;
  hand: Card[];
  field: Card[];
  status: Status;
  sumFields: SumCards;
};

type GameData = {
  turn: number;
  players: string[];
  missions: number[];
  firstAtkPlayer: PlayerSign | undefined;
};

export type { Card, Character, Gift, Mission, Phase, MatchStatus, PlayerSign, Status, PlayerData, SumCards, GameData };
