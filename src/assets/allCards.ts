import type { Card } from "@/types";
const allCards: Card[] =[
  {
    "id": 0,
    "name": "腐ったカード",
    "waste": 0,
    "hungry": 0,
    "company": "none",
    "description": "このカードは腐っている。",
    "rotten": true
  },
  {
    "id": 1,
    "name": "フライドポテト",
    "waste": 5,
    "hungry": 10,
    "company": "galdaybee",
    "description": "このカードは現在の消費期限🦠1ごとにマッスルダメージを💪+5する。",
    "atk": 15
  },
  {
    "id": 2,
    "name": "タコス",
    "waste": 5,
    "hungry": 10,
    "company": "galdaybee",
    "atk": 25
  },
  {
    "id": 3,
    "name": "スイカ",
    "waste": 6,
    "hungry": 20,
    "company": "bulbull",
    "atk": 35
  },
  {
    "id": 4,
    "name": "ドーナツ",
    "waste": 5,
    "hungry": 20,
    "company": "rapidpot",
    "atk": 40
  },
  {
    "id": 5,
    "name": "フライドチキン",
    "waste": 5,
    "hungry": 20,
    "company": "galdaybee",
    "description": "このカードは現在の消費期限🦠1ごとにマッスルダメージを💪+5する。",
    "atk": 40
  },
  {
    "id": 6,
    "name": "ハンバーガー",
    "waste": 5,
    "hungry": 20,
    "company": "galdaybee",
    "atk": 50
  },
  {
    "id": 7,
    "name": "チーズバーガー",
    "waste": 4,
    "hungry": 30,
    "company": "galdaybee",
    "atk": 80
  },
  {
    "id": 8,
    "name": "ペッパーライス",
    "waste": 4,
    "hungry": 30,
    "company": "galdaybee",
    "description": "このラウンド中、スピード🦶-2で行動する。",
    "priority": -2,
    "atk": 105
  },
  {
    "id": 9,
    "name": "改造マシュマロ",
    "waste": 4,
    "hungry": 40,
    "company": "unlimit",
    "description": "ラウンド終了時にこのカードが手札にあるとき、手札にあるカードの満腹度を🍖-10する。",
    "atk": 40
  },
  {
    "id": 10,
    "name": "サラダ",
    "waste": 5,
    "hungry": 40,
    "company": "bulbull",
    "description": "このカードが腐ったカードになったとき、自動的にリサイクルされる。",
    "atk": 75
  },
  {
    "id": 11,
    "name": "パンケーキ",
    "waste": 4,
    "hungry": 40,
    "company": "rapidpot",
    "description": "このカードは自身の満腹度🍖50ごとに満腹度を🍖-5する。",
    "atk": 85
  },
  {
    "id": 12,
    "name": "クリームソーダ",
    "waste": 5,
    "hungry": 40,
    "company": "bulbull",
    "atk": 90
  },
  {
    "id": 13,
    "name": "クレープ",
    "waste": 4,
    "hungry": 40,
    "company": "rapidpot",
    "atk": 95
  },
  {
    "id": 14,
    "name": "ギガ盛りご飯",
    "waste": 4,
    "hungry": 40,
    "company": "galdaybee",
    "atk": 105
  },
  {
    "id": 15,
    "name": "改造ギガ盛りご飯",
    "waste": 4,
    "hungry": 40,
    "company": "unlimit",
    "description": "このラウンド中、相手のあらゆる効果を無視してマッスルダメージを与える。",
    "atk": 105
  },
  {
    "id": 16,
    "name": "ピザ",
    "waste": 4,
    "hungry": 40,
    "company": "galdaybee",
    "description": "このラウンド中、スピード🦶-2で行動する。",
    "priority": -2,
    "atk": 135
  },
  {
    "id": 17,
    "name": "ギガメガ盛りご飯",
    "waste": 3,
    "hungry": 50,
    "company": "galdaybee",
    "atk": 135
  },
  {
    "id": 18,
    "name": "ハンバーグ",
    "waste": 2,
    "hungry": 50,
    "company": "galdaybee",
    "atk": 145
  },
  {
    "id": 19,
    "name": "ゼリー",
    "waste": 4,
    "hungry": 60,
    "company": "bulbull",
    "atk": 150
  },
  {
    "id": 20,
    "name": "ショートケーキ",
    "waste": 3,
    "hungry": 60,
    "company": "rapidpot",
    "atk": 155
  },
  {
    "id": 21,
    "name": "ギガメガテラ盛りご飯",
    "waste": 3,
    "hungry": 60,
    "company": "galdaybee",
    "atk": 160
  },
  {
    "id": 22,
    "name": "ステーキ",
    "waste": 2,
    "hungry": 60,
    "company": "galdaybee",
    "atk": 170
  },
  {
    "id": 23,
    "name": "生ハム",
    "waste": 4,
    "hungry": 10,
    "company": "bianca",
    "description": "このラウンド中、スピード🦶+1で行動する。",
    "priority": 1,
    "tech": 5
  },
  {
    "id": 24,
    "name": "そうめん",
    "waste": 6,
    "hungry": 10,
    "company": "bulbull",
    "tech": 5
  },
  {
    "id": 25,
    "name": "マカロン",
    "waste": 5,
    "hungry": 10,
    "company": "rapidpot",
    "tech": 10
  },
  {
    "id": 26,
    "name": "アイスティー",
    "waste": 5,
    "hungry": 10,
    "company": "bianca",
    "tech": 15
  },
  {
    "id": 27,
    "name": "チーズ",
    "waste": 4,
    "hungry": 20,
    "company": "bianca",
    "description": "このラウンド中、スピード🦶+1で行動する。",
    "priority": 1,
    "tech": 15
  },
  {
    "id": 28,
    "name": "ミルクティー",
    "waste": 5,
    "hungry": 20,
    "company": "bianca",
    "tech": 30
  },
  {
    "id": 29,
    "name": "冷奴",
    "waste": 5,
    "hungry": 30,
    "company": "bulbull",
    "tech": 20
  },
  {
    "id": 30,
    "name": "ティラミス",
    "waste": 4,
    "hungry": 30,
    "company": "rapidpot",
    "tech": 25
  },
  {
    "id": 31,
    "name": "ラザニア",
    "waste": 4,
    "hungry": 30,
    "company": "bianca",
    "description": "このラウンド中、自身が相手に与えるテクニックダメージと同じだけ相手のシールドの耐久値を減少させる。",
    "tech": 40
  },
  {
    "id": 32,
    "name": "フランスパン",
    "waste": 4,
    "hungry": 30,
    "company": "bianca",
    "tech": 50
  },
  {
    "id": 33,
    "name": "ソフトクリーム",
    "waste": 5,
    "hungry": 40,
    "company": "bulbull",
    "description": "このカードが腐ったカードになったとき、自動的にリサイクルされる。",
    "tech": 35
  },
  {
    "id": 34,
    "name": "改造まんぷく寿司",
    "waste": 4,
    "hungry": 40,
    "company": "unlimit",
    "description": "このカードが手札にあるときに❤️HPが0になった場合、❤️+200、🍖-300して復活する。",
    "tech": 40
  },
  {
    "id": 35,
    "name": "ワッフル",
    "waste": 4,
    "hungry": 40,
    "company": "rapidpot",
    "description": "このカードは自身の満腹度🍖50ごとに満腹度を🍖-5する。",
    "tech": 50
  },
  {
    "id": 36,
    "name": "パエリア",
    "waste": 4,
    "hungry": 40,
    "company": "bianca",
    "description": "このラウンド中、自身のテクニックダメージと同じだけ相手のシールドの耐久値を減少させる。",
    "tech": 55
  },
  {
    "id": 37,
    "name": "改造ラザニア",
    "waste": 4,
    "hungry": 40,
    "company": "unlimit",
    "description": "このラウンド中、テクニックダメージが相手のシールドの影響を受けるようになり、与えるテクニックダメージが4倍になる。",
    "tech": 55
  },
  {
    "id": 38,
    "name": "アヒージョ",
    "waste": 4,
    "hungry": 40,
    "company": "bianca",
    "tech": 65
  },
  {
    "id": 39,
    "name": "チョコレート",
    "waste": 4,
    "hungry": 50,
    "company": "bulbull",
    "tech": 40
  },
  {
    "id": 40,
    "name": "チョコケーキ",
    "waste": 3,
    "hungry": 50,
    "company": "rapidpot",
    "tech": 45
  },
  {
    "id": 41,
    "name": "スパゲッティ",
    "waste": 3,
    "hungry": 50,
    "company": "bianca",
    "description": "このカードは相手の満腹度が🍖100以上のとき、テクニックダメージを⚡️+30する。",
    "tech": 75
  },
  {
    "id": 42,
    "name": "グラタン",
    "waste": 3,
    "hungry": 50,
    "company": "bianca",
    "tech": 85
  },
  {
    "id": 43,
    "name": "ドリア",
    "waste": 3,
    "hungry": 60,
    "company": "bianca",
    "description": "このカードは相手の満腹度が🍖100以上のとき、テクニックダメージを⚡️+30する。",
    "tech": 90
  },
  {
    "id": 44,
    "name": "ローストビーフ",
    "waste": 3,
    "hungry": 60,
    "company": "bianca",
    "tech": 100
  },
  {
    "id": 45,
    "name": "かき氷",
    "waste": 4,
    "hungry": 5,
    "company": "norma",
    "def": 35
  },
  {
    "id": 46,
    "name": "ホワイトチョコレート",
    "waste": 6,
    "hungry": 10,
    "company": "bulbull",
    "def": 25
  },
  {
    "id": 47,
    "name": "プリン",
    "waste": 5,
    "hungry": 10,
    "company": "rapidpot",
    "def": 30
  },
  {
    "id": 48,
    "name": "ラムネ",
    "waste": 5,
    "hungry": 10,
    "company": "norma",
    "def": 35
  },
  {
    "id": 49,
    "name": "りんご飴",
    "waste": 4,
    "hungry": 15,
    "company": "norma",
    "def": 70
  },
  {
    "id": 50,
    "name": "焼き鳥",
    "waste": 5,
    "hungry": 20,
    "company": "norma",
    "def": 70
  },
  {
    "id": 51,
    "name": "おにぎり",
    "waste": 4,
    "hungry": 30,
    "company": "norma",
    "description": "このラウンド中、スピード🦶+1で行動する。",
    "priority": 1,
    "def": 80
  },
  {
    "id": 52,
    "name": "スポーツドリンク",
    "waste": 5,
    "hungry": 30,
    "company": "bulbull",
    "def": 100
  },
  {
    "id": 53,
    "name": "モンブラン",
    "waste": 4,
    "hungry": 30,
    "company": "rapidpot",
    "def": 105
  },
  {
    "id": 54,
    "name": "焼きそば",
    "waste": 4,
    "hungry": 30,
    "company": "norma",
    "def": 110
  },
  {
    "id": 55,
    "name": "冷やし中華",
    "waste": 5,
    "hungry": 40,
    "company": "bulbull",
    "description": "このカードが腐ったカードになったとき、自動的にリサイクルされる。",
    "def": 110
  },
  {
    "id": 56,
    "name": "焼きおにぎり",
    "waste": 4,
    "hungry": 40,
    "company": "norma",
    "description": "このラウンド中、スピード🦶+1で行動する。",
    "priority": 1,
    "def": 115
  },
  {
    "id": 57,
    "name": "シュークリーム",
    "waste": 4,
    "hungry": 40,
    "company": "rapidpot",
    "description": "このカードは自身の満腹度🍖50ごとに満腹度を🍖-5する。",
    "def": 130
  },
  {
    "id": 58,
    "name": "イカ焼き",
    "waste": 4,
    "hungry": 40,
    "company": "norma",
    "def": 145
  },
  {
    "id": 59,
    "name": "改造おにぎり",
    "waste": 4,
    "hungry": 40,
    "company": "unlimit",
    "description": "2ラウンドの間、スピード🦶+100で行動する。",
    "def": 145
  },
  {
    "id": 60,
    "name": "たこ焼き",
    "waste": 3,
    "hungry": 50,
    "company": "norma",
    "description": "このカードは相手より後に行動したとき、満腹度が🍖0になる。",
    "def": 75
  },
  {
    "id": 61,
    "name": "メロン",
    "waste": 4,
    "hungry": 50,
    "company": "bulbull",
    "def": 175
  },
  {
    "id": 62,
    "name": "ロールケーキ",
    "waste": 3,
    "hungry": 50,
    "company": "rapidpot",
    "def": 180
  },
  {
    "id": 63,
    "name": "お好み焼き",
    "waste": 3,
    "hungry": 50,
    "company": "norma",
    "def": 185
  },
  {
    "id": 64,
    "name": "メンチカツ",
    "waste": 3,
    "hungry": 60,
    "company": "norma",
    "description": "このカードは相手より後に行動したとき、満腹度が🍖0になる。",
    "def": 110
  },
  {
    "id": 65,
    "name": "ラーメン",
    "waste": 3,
    "hungry": 60,
    "company": "norma",
    "def": 220
  },
  {
    "id": 66,
    "name": "ジャンボフランクフルト",
    "waste": 4,
    "hungry": 15,
    "company": "galdaybee",
    "description": "このカードは後攻のとき、マッスルダメージを💪+75する。"
  },
  {
    "id": 67,
    "name": "うどん",
    "waste": 5,
    "hungry": 15,
    "company": "hanamie",
    "description": "このラウンド中、スピードを🦶+2で行動する。",
    "priority": 2
  },
  {
    "id": 68,
    "name": "天ぷら",
    "waste": 3,
    "hungry": 20,
    "company": "hanamie",
    "description": "最大HPを❤️+25し、HPを❤️+25回復する。",
    "heal": 25
  },
  {
    "id": 69,
    "name": "おはぎ",
    "waste": 4,
    "hungry": 20,
    "company": "hanamie",
    "description": "次のラウンド開始時、マッスルカードを1枚ドローする。"
  },
  {
    "id": 70,
    "name": "大福",
    "waste": 4,
    "hungry": 20,
    "company": "hanamie",
    "description": "次のラウンド開始時、テクニックカードを1枚ドローする。"
  },
  {
    "id": 71,
    "name": "ようかん",
    "waste": 4,
    "hungry": 20,
    "company": "hanamie",
    "description": "次のラウンド開始時、シールドカードを1枚ドローする。"
  },
  {
    "id": 72,
    "name": "八ツ橋",
    "waste": 4,
    "hungry": 20,
    "company": "hanamie",
    "description": "次のラウンド開始時、サポートカードを1枚ドローする。"
  },
  {
    "id": 73,
    "name": "たい焼き",
    "waste": 4,
    "hungry": 25,
    "company": "norma",
    "description": "このカードは使用時の自身の満腹度と同じだけシールドを獲得する。"
  },
  {
    "id": 74,
    "name": "マシュマロ",
    "waste": 5,
    "hungry": 25,
    "company": "rapidpot",
    "description": "手札にあるカードの満腹度を🍖-5する。"
  },
  {
    "id": 75,
    "name": "蕎麦",
    "waste": 5,
    "hungry": 25,
    "company": "hanamie",
    "description": "このラウンド中、スピードを🦶+3で行動する。",
    "priority": 3
  },
  {
    "id": 76,
    "name": "サンドウィッチ",
    "waste": 4,
    "hungry": 30,
    "company": "galdaybee",
    "description": "手札にあるマッスルカードのマッスルダメージを💪+10する。"
  },
  {
    "id": 77,
    "name": "焼き芋",
    "waste": 4,
    "hungry": 30,
    "company": "norma",
    "description": "ラウンド終了時、残っているシールドを次のラウンドに持ち越す。"
  },
  {
    "id": 78,
    "name": "抹茶",
    "waste": 3,
    "hungry": 30,
    "company": "hanamie",
    "description": "手札の中からランダムな1枚のカードの満腹度を🍖0にする(満腹度が🍖0のカードは対象にならない)。"
  },
  {
    "id": 79,
    "name": "茶碗蒸し",
    "waste": 3,
    "hungry": 30,
    "company": "hanamie",
    "description": "手札の中からランダムな1枚のカードの消費期限を🦠6にする(消費期限が🦠6以上のカードは対象にならない)。"
  },
  {
    "id": 80,
    "name": "ミルク",
    "waste": 6,
    "hungry": 35,
    "company": "bulbull",
    "description": "手札にあるカードの消費期限を🦠+1する。"
  },
  {
    "id": 81,
    "name": "オムレツ",
    "waste": 5,
    "hungry": 40,
    "company": "bianca",
    "description": "このラウンド中、受けるマッスルダメージを自身のテクニックダメージと同じだけ軽減する。"
  },
  {
    "id": 82,
    "name": "まんぷく寿司・梅",
    "waste": 4,
    "hungry": 40,
    "company": "hanamie",
    "description": "HPを❤️+50回復する。",
    "heal": 50
  },
  {
    "id": 83,
    "name": "改造エナジードリンク",
    "waste": 4,
    "hungry": 40,
    "company": "unlimit",
    "description": "次のラウンド開始時、初期消費期限を🦠8、満腹度を🍖0で固定したランダムなカードを3枚ドローする。"
  },
  {
    "id": 84,
    "name": "ワイン",
    "waste": 3,
    "hungry": 45,
    "company": "bianca",
    "description": "このラウンド中、与えたテクニックダメージと同じだけ❤️HPを回復する。"
  },
  {
    "id": 85,
    "name": "おでん",
    "waste": 5,
    "hungry": 45,
    "company": "norma",
    "description": "ラウンド終了時、残っているシールドの耐久値と同じだけ❤️HPを回復する。"
  },
  {
    "id": 86,
    "name": "フルーツタルト",
    "waste": 5,
    "hungry": 45,
    "company": "rapidpot",
    "description": "次のラウンド開始時、満腹度を🍖-20したランダムなカードを1枚ドローする。"
  },
  {
    "id": 87,
    "name": "エナジードリンク",
    "waste": 5,
    "hungry": 45,
    "company": "bulbull",
    "description": "次のラウンドの開始時、初期消費期限を🦠7で固定したランダムなカードを1枚ドローする。"
  },
  {
    "id": 88,
    "name": "わらび餅",
    "waste": 5,
    "hungry": 45,
    "company": "bulbull",
    "description": "手札にある腐ったカードを1枚リサイクルする。"
  },
  {
    "id": 89,
    "name": "しゃぶしゃぶ",
    "waste": 3,
    "hungry": 45,
    "company": "hanamie",
    "description": "最大HPを❤️+50し、HPを❤️+50回復する。",
    "heal": 50
  },
  {
    "id": 90,
    "name": "刺身",
    "waste": 5,
    "hungry": 45,
    "company": "hanamie",
    "description": "このラウンド中、受けたダメージをこのラウンドのマッスルダメージに加算する。"
  },
  {
    "id": 91,
    "name": "まんぷく寿司・竹",
    "waste": 4,
    "hungry": 50,
    "company": "hanamie",
    "description": "HPを❤️+100回復する。",
    "heal": 100
  },
  {
    "id": 92,
    "name": "うな重",
    "waste": 5,
    "hungry": 50,
    "company": "hanamie",
    "description": "このラウンド中、受けるマッスルダメージを無効化する。"
  },
  {
    "id": 93,
    "name": "アップルパイ",
    "waste": 4,
    "hungry": 55,
    "company": "rapidpot",
    "description": "最大満腹度を🍖+20する。"
  },
  {
    "id": 94,
    "name": "まんぷく寿司・松",
    "waste": 4,
    "hungry": 60,
    "company": "hanamie",
    "description": "HPを❤️+150回復する。",
    "heal": 150
  },
  {
    "id": 95,
    "name": "紅茶",
    "waste": 3,
    "hungry": 65,
    "company": "bianca",
    "description": "手札にあるテクニックカードにスピード🦶+1の特殊効果を追加する。"
  },
  {
    "id": 96,
    "name": "プロテイン",
    "waste": 5,
    "hungry": 75,
    "company": "galdaybee",
    "description": "このラウンド中、与えるマッスルダメージを2倍にする。"
  }
]

export default allCards;
