import type { Card } from "@/types";
const allCards: Card[] = [
  {
    id: 0,
    name: "腐ったカード",
    waste: 0,
    hungry: 0,
    company: "nothing",
    description: "このカードは使用できない。",
    rotten: true,
  },
  {
    id: 1,
    name: "ホットドック",
    waste: 5,
    hungry: 10,
    company: "galdaybee",
    attribute: "atk",
    atk: 25,
  },
  {
    id: 2,
    name: "ドーナツ",
    waste: 5,
    hungry: 20,
    company: "rapidpot",
    attribute: "atk",
    atk: 40,
  },
  {
    id: 3,
    name: "タコス",
    waste: 5,
    hungry: 20,
    company: "galdaybee",
    attribute: "atk",
    atk: 50,
  },
  {
    id: 4,
    name: "ハンバーガー",
    waste: 4,
    hungry: 30,
    company: "galdaybee",
    attribute: "atk",
    atk: 80,
  },
  {
    id: 5,
    name: "ペッパーライス",
    waste: 4,
    hungry: 30,
    company: "galdaybee",
    attribute: "atk",
    description: "このラウンド中、スピード🦶-2で行動する。",
    priority: -2,
    atk: 105,
  },
  {
    id: 6,
    name: "改造パンケーキ",
    waste: 4,
    hungry: 40,
    company: "unlimit",
    attribute: "atk",
    description: "ラウンド終了時にこのカードが手札にあるとき、手札にあるカードの満腹度を🍖-10する。",
    atk: 40,
  },
  {
    id: 7,
    name: "パンケーキ",
    waste: 4,
    hungry: 40,
    company: "rapidpot",
    attribute: "atk",
    description: "ラウンド終了時、自身の満腹度が🍖100以上のとき、自身の満腹度を🍖-25する。",
    atk: 85,
  },
  {
    id: 8,
    name: "クレープ",
    waste: 4,
    hungry: 40,
    company: "rapidpot",
    attribute: "atk",
    atk: 95,
  },
  {
    id: 9,
    name: "フライドチキン",
    waste: 4,
    hungry: 40,
    company: "galdaybee",
    attribute: "atk",
    atk: 105,
  },
  {
    id: 10,
    name: "改造フライドチキン",
    waste: 4,
    hungry: 40,
    company: "unlimit",
    attribute: "atk",
    description: "このラウンド中、相手のあらゆる効果を無視してマッスルダメージを与える。",
    atk: 105,
  },
  {
    id: 11,
    name: "ピザ",
    waste: 4,
    hungry: 40,
    company: "galdaybee",
    attribute: "atk",
    description: "このラウンド中、スピード🦶-2で行動する。",
    priority: -2,
    atk: 135,
  },
  {
    id: 12,
    name: "オムライス",
    waste: 3,
    hungry: 50,
    company: "galdaybee",
    attribute: "atk",
    atk: 135,
  },
  {
    id: 13,
    name: "ハンバーグ",
    waste: 2,
    hungry: 50,
    company: "galdaybee",
    attribute: "atk",
    atk: 145,
  },
  {
    id: 14,
    name: "ショートケーキ",
    waste: 3,
    hungry: 60,
    company: "rapidpot",
    attribute: "atk",
    atk: 155,
  },
  {
    id: 15,
    name: "ローストターキー",
    waste: 3,
    hungry: 60,
    company: "galdaybee",
    attribute: "atk",
    atk: 160,
  },
  {
    id: 16,
    name: "ステーキ",
    waste: 2,
    hungry: 60,
    company: "galdaybee",
    attribute: "atk",
    atk: 170,
  },
  {
    id: 17,
    name: "ワイン",
    waste: 4,
    hungry: 10,
    company: "bianca",
    attribute: "tech",
    description: "貢献度を🔔+5する。",
    priority: 1,
    tech: 5,
  },
  {
    id: 18,
    name: "マカロン",
    waste: 5,
    hungry: 10,
    company: "rapidpot",
    attribute: "tech",
    tech: 10,
  },
  {
    id: 19,
    name: "アイスティー",
    waste: 5,
    hungry: 10,
    company: "bianca",
    attribute: "tech",
    tech: 15,
  },
  {
    id: 20,
    name: "生ハム",
    waste: 4,
    hungry: 20,
    company: "bianca",
    attribute: "tech",
    description: "貢献度を🔔+5する。",
    priority: 1,
    tech: 15,
  },
  {
    id: 21,
    name: "チーズ",
    waste: 5,
    hungry: 20,
    company: "bianca",
    attribute: "tech",
    tech: 30,
  },
  {
    id: 22,
    name: "ティラミス",
    waste: 4,
    hungry: 30,
    company: "rapidpot",
    attribute: "tech",
    tech: 25,
  },
  {
    id: 23,
    name: "カプレーゼ",
    waste: 4,
    hungry: 30,
    company: "bianca",
    attribute: "tech",
    tech: 50,
  },
  {
    id: 24,
    name: "改造焼き魚",
    waste: 4,
    hungry: 40,
    company: "unlimit",
    attribute: "tech",
    description: "このカードが手札にあるときに❤️HPが0になった場合、❤️+250、🍖-300して復活する。",
    tech: 40,
  },
  {
    id: 25,
    name: "ワッフル",
    waste: 4,
    hungry: 40,
    company: "rapidpot",
    attribute: "tech",
    description: "ラウンド終了時、自身の満腹度が🍖100以上のとき、自身の満腹度を🍖-25する。",
    tech: 50,
  },
  {
    id: 26,
    name: "改造生ハム",
    waste: 4,
    hungry: 40,
    company: "unlimit",
    attribute: "tech",
    description: "貢献度を🔔+50する。",
    tech: 55,
  },
  {
    id: 27,
    name: "フランスパン",
    waste: 4,
    hungry: 40,
    company: "bianca",
    attribute: "tech",
    tech: 65,
  },
  {
    id: 28,
    name: "フルーツタルト",
    waste: 3,
    hungry: 50,
    company: "rapidpot",
    attribute: "tech",
    tech: 45,
  },
  {
    id: 29,
    name: "ラザニア",
    waste: 3,
    hungry: 50,
    company: "bianca",
    attribute: "tech",
    description: "このカードは相手の満腹度が🍖100以上のとき、テクニックダメージを⚡️+30する。",
    tech: 75,
  },
  {
    id: 30,
    name: "グラタン",
    waste: 3,
    hungry: 50,
    company: "bianca",
    attribute: "tech",
    tech: 85,
  },
  {
    id: 31,
    name: "アクアパッツァ",
    waste: 3,
    hungry: 60,
    company: "bianca",
    attribute: "tech",
    description: "このカードは相手の満腹度が🍖100以上のとき、テクニックダメージを⚡️+30する。",
    tech: 90,
  },
  {
    id: 32,
    name: "ローストビーフ",
    waste: 3,
    hungry: 60,
    company: "bianca",
    attribute: "tech",
    tech: 100,
  },
  {
    id: 33,
    name: "かき氷",
    waste: 4,
    hungry: 5,
    company: "norma",
    attribute: "def",
    def: 35,
  },
  {
    id: 34,
    name: "プリン",
    waste: 5,
    hungry: 10,
    company: "rapidpot",
    attribute: "def",
    def: 30,
  },
  {
    id: 35,
    name: "ラムネ",
    waste: 5,
    hungry: 10,
    company: "norma",
    attribute: "def",
    def: 35,
  },
  {
    id: 36,
    name: "りんご飴",
    waste: 4,
    hungry: 15,
    company: "norma",
    attribute: "def",
    def: 70,
  },
  {
    id: 37,
    name: "焼き鳥",
    waste: 5,
    hungry: 20,
    company: "norma",
    attribute: "def",
    def: 70,
  },
  {
    id: 38,
    name: "焼きとうもろこし",
    waste: 4,
    hungry: 30,
    company: "norma",
    attribute: "def",
    description: "このラウンド中、スピード🦶+1で行動する。",
    priority: 1,
    def: 80,
  },
  {
    id: 39,
    name: "モンブラン",
    waste: 4,
    hungry: 30,
    company: "rapidpot",
    attribute: "def",
    def: 105,
  },
  {
    id: 40,
    name: "チョコバナナ",
    waste: 4,
    hungry: 30,
    company: "norma",
    attribute: "def",
    def: 110,
  },
  {
    id: 41,
    name: "おにぎり",
    waste: 4,
    hungry: 40,
    company: "norma",
    attribute: "def",
    description: "このラウンド中、スピード🦶+1で行動する。",
    priority: 1,
    def: 115,
  },
  {
    id: 42,
    name: "チョコケーキ",
    waste: 4,
    hungry: 40,
    company: "rapidpot",
    attribute: "def",
    description: "ラウンド終了時、自身の満腹度が🍖100以上のとき、自身の満腹度を🍖-25する。",
    def: 130,
  },
  {
    id: 43,
    name: "イカ焼き",
    waste: 4,
    hungry: 40,
    company: "norma",
    attribute: "def",
    def: 145,
  },
  {
    id: 44,
    name: "たこ焼き",
    waste: 3,
    hungry: 50,
    company: "norma",
    attribute: "def",
    description: "このカードは後攻のとき、満腹度が🍖0になる。",
    def: 75,
  },
  {
    id: 45,
    name: "ロールケーキ",
    waste: 3,
    hungry: 50,
    company: "rapidpot",
    attribute: "def",
    def: 180,
  },
  {
    id: 46,
    name: "お好み焼き",
    waste: 3,
    hungry: 50,
    company: "norma",
    attribute: "def",
    def: 185,
  },
  {
    id: 47,
    name: "メンチカツ",
    waste: 3,
    hungry: 60,
    company: "norma",
    attribute: "def",
    description: "このカードは後攻のとき、満腹度が🍖0になる。",
    def: 110,
  },
  {
    id: 48,
    name: "焼きそば",
    waste: 3,
    hungry: 60,
    company: "norma",
    attribute: "def",
    def: 220,
  },
  {
    id: 49,
    name: "ジャンボフランクフルト",
    waste: 4,
    hungry: 15,
    company: "galdaybee",
    attribute: "atk",
    description: "このカードは後攻のとき、マッスルダメージを💪+75する。",
  },
  {
    id: 50,
    name: "抹茶",
    waste: 5,
    hungry: 15,
    company: "hanamie",
    attribute: "sup",
    description: "このラウンド中、スピードを🦶+2で行動する。",
    priority: 2,
  },
  {
    id: 51,
    name: "おはぎ",
    waste: 4,
    hungry: 20,
    company: "hanamie",
    attribute: "sup",
    description: "次のラウンド開始時、マッスルカードを1枚ドローする。",
  },
  {
    id: 52,
    name: "大福",
    waste: 4,
    hungry: 20,
    company: "hanamie",
    attribute: "sup",
    description: "次のラウンド開始時、テクニックカードを1枚ドローする。",
  },
  {
    id: 53,
    name: "ようかん",
    waste: 4,
    hungry: 20,
    company: "hanamie",
    attribute: "sup",
    description: "次のラウンド開始時、シールドカードを1枚ドローする。",
  },
  {
    id: 54,
    name: "八ツ橋",
    waste: 4,
    hungry: 20,
    company: "hanamie",
    attribute: "sup",
    description: "次のラウンド開始時、サポートカードを1枚ドローする。",
  },
  {
    id: 55,
    name: "たい焼き",
    waste: 4,
    hungry: 25,
    company: "norma",
    attribute: "def",
    description: "このカードは使用時の自身の満腹度と同じだけシールドを獲得する。",
  },
  {
    id: 56,
    name: "茶碗蒸し",
    waste: 5,
    hungry: 25,
    company: "hanamie",
    attribute: "sup",
    description: "このラウンド中、スピードを🦶+3で行動する。",
    priority: 3,
  },
  {
    id: 57,
    name: "フライドポテト",
    waste: 4,
    hungry: 30,
    company: "galdaybee",
    attribute: "sup",
    description: "ラウンド終了時、手札にあるマッスルカードのマッスルダメージを💪+10する。",
  },
  {
    id: 58,
    name: "焼き芋",
    waste: 4,
    hungry: 30,
    company: "norma",
    attribute: "sup",
    description: "ラウンド終了時、手札にあるシールドカードのシールドを🛡️+20する。",
  },
  {
    id: 59,
    name: "改造焼き芋",
    waste: 4,
    hungry: 40,
    company: "unlimit",
    attribute: "sup",
    description: "ラウンド終了時、手札にあるシールドカードのシールドを自身のシールドと同じだけを増やす。",
  },
  {
    id: 60,
    name: "焼き魚",
    waste: 4,
    hungry: 40,
    company: "hanamie",
    attribute: "heal",
    description: "HPを❤️+50回復する。",
    heal: 50,
  },
  {
    id: 61,
    name: "お寿司",
    waste: 4,
    hungry: 50,
    company: "hanamie",
    attribute: "heal",
    description: "HPを❤️+100回復する。",
    heal: 100,
  },
  {
    id: 62,
    name: "アップルパイ",
    waste: 4,
    hungry: 55,
    company: "rapidpot",
    attribute: "sup",
    description: "最大満腹度を🍖+20する。",
  },
  {
    id: 63,
    name: "天ぷら",
    waste: 4,
    hungry: 60,
    company: "hanamie",
    attribute: "heal",
    description: "HPを❤️+150回復する。",
    heal: 150,
  },
  {
    id: 64,
    name: "プロテイン",
    waste: 5,
    hungry: 75,
    company: "galdaybee",
    attribute: "sup",
    description: "このラウンド中、与えるマッスルダメージを2倍にする。",
  },
];
export default allCards;
