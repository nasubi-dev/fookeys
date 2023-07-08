import type { Character } from "@/types";
const allCharacters: Character[] = [
  {
    id: 0,
    name: "プティー＆スポット",
    description: "ラウンド終了時の減少満腹度を追加で🍖-20する",
    company: "rapidpot",
    maxHungry: 50,
  },
  {
    id: 1,
    name: "ミューゼ",
    description: "ギフトを同時に2つまで使用できる獲得貢献度を2倍にするギフトを使用したとき、ランダムなカードを1枚ドローする",
    company: "bulbull",
    initialContribution: 100,
  },
  {
    id: 2,
    name: "ユウダチ",
    description: "使用したサポートカード×5のHPを回復するフードバンクにサポートカードを寄付したとき、その効果を得る。",
    company: "hanamie",
    maxHp: 900,
  },
  {
    id: 3,
    name: "ナベナベ",
    description: "シールドで軽減しきれなかったとき、受けるマッスルダメージが❤️100になる。自身の満腹度🍖10ごとにシールドを🛡+5する。この効果はラウンド開始時に発動する。",
    company: "norma",
  },
  {
    id: 4,
    name: "バルグ",
    description: "マッスルカードの出現率が2倍になる。ダメージを受けると手札にあるマッスルカードのマッスルダメージを💪+20する。",
    company: "galdaybee",
  },
  {
    id: 5,
    name: "ブランキッス",
    description: "通常のミッションに追加して自分だけのミッションを1つ得る。自身の貢献度、所持カードの会社、使用したギフトの種類を相手に公開しない。HPが❤️300以下のとき、自身のHPと使用したサポートカードを相手に公開しない。",
    company: "bianca",
  },
  {
    id: 6,
    name: "ガラガシャ",
    description: "1ラウンドに1度までドローカードの再抽選ができる。1ラウンドにカードを5枚以上使用したとき、スピードを🦶+1する。ラウンド終了時に自分の手札のカードの満腹度を🍖-5する。",
    company: "unlimit",
  },
];
export default allCharacters;
