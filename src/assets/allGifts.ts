import { e, s, i } from "@/log";
import type { Gift } from "@/types";

const allGifts: Gift[] = [
  {
    id: 0,
    name: "マジック",
    description: "手札を全て入れ替える",
    requireContribution: 15,
    skill: (id: string) => {
      console.log(i, id + "の使用したギフト1");
    },
  },
  {
    id: 1,
    name: "つまみ食い",
    description: "手札のカードの満腹度を🍖-10する",
    requireContribution: 20,
    skill: () => console.log(i, "ギフト2"),
  },
  {
    id: 2,
    name: "塩漬け",
    description: "手札のカードの満腹度を🍖-10する",
    requireContribution: 25,
    skill: () => console.log(i, "ギフト3"),
  },
  {
    id: 3,
    name: "食事制限",
    description: "30	このラウンド中相手は3枚までしかカードを使用できない",
    requireContribution: 30,
    skill: () => console.log(i, "ギフト4"),
  },
  {
    id: 4,
    name: "お昼寝",
    description: "HPを❤️+200する",
    requireContribution: 35,
    skill: () => console.log(i, "ギフト5"),
  },
  {
    id: 5,
    name: "リサイクル",
    description: "腐ったカードを手札から全部消す",
    requireContribution: 40,
    skill: () => console.log(i, "ギフト6"),
  },
  {
    id: 6,
    name: "お散歩",
    description: "自身の満腹度を🍖-100する",
    requireContribution: 45,
    skill: () => console.log(i, "ギフト7"),
  },
  {
    id: 7,
    name: "サプリメント",
    description: "このラウンド中相手から受けるダメージを無効化する",
    requireContribution: 50,
    skill: () => console.log(i, "ギフト8"),
  },
  {
    id: 8,
    name: "バリア",
    description: "このラウンド中相手から受けるダメージを無効化する",
    requireContribution: 55,
    skill: () => console.log(i, "ギフト9"),
  },
  {
    id: 9,
    name: "福袋",
    description: "カードを6枚ドローする",
    requireContribution: 60,
    skill: () => console.log(i, "ギフト10"),
  },
  {
    id: 10,
    name: "早食い",
    description: "スピード🦶+2する",
    requireContribution: 65,
    skill: () => console.log(i, "ギフト11"),
  },
  {
    id: 11,
    name: "飯テロ",
    description: "このラウンド中相手はマッスルカードしか使えない",
    requireContribution: 70,
    skill: () => console.log(i, "ギフト12"),
  },
];
export default allGifts;
