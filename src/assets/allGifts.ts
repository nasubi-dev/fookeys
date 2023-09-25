import { e, s, i } from "@/log";
import type { Gift } from "@/types";
import { changeAllHand, changeHandValue, changeStatusValue, setHand, deleteAllWaste0,changeSumCardsValue } from "@/server/useShopUtils";

const allGifts: Gift[] = [
  {
    id: 0,
    name: "マジック",
    description: "手札を全て入れ替える",
    requireContribution: 15,
    skill: (timing) => {
      if (timing !== "before") return;
      changeAllHand();
    },
  },
  {
    id: 1,
    name: "つまみ食い",
    description: "手札のカードの満腹度を🍖-10する",
    requireContribution: 20,
    skill: (timing) => {
      if (timing !== "before") return;
      changeHandValue("hungry", -10);
    },
  },
  {
    id: 2,
    name: "冷凍保存",
    description: "手札の消費期限を🦠+1する",
    requireContribution: 25,
    skill: (timing) => {
      if (timing !== "before") return;
      changeHandValue("waste", 1);
    },
  },
  {
    id: 3,
    name: "ドクターストップ",
    description: "このラウンド中相手は3枚までしかカードを使用できない",
    requireContribution: 30,
    skill: () => {
      console.log(i, "食事制限を実行しました");
    },
  },
  {
    id: 4,
    name: "栄養バランス",
    description: "HPを❤️+200する",
    requireContribution: 35,
    skill: (timing) => {
      if (timing !== "before") return;
      changeStatusValue("hp", 200);
    },
  },
  {
    id: 5,
    name: "リサイクル",
    description: "腐ったカードを手札から全部消す",
    requireContribution: 40,
    skill: (timing) => {
      if (timing !== "before") return;
      deleteAllWaste0();
    },
  },
  {
    id: 6,
    name: "リサーチ",
    description: "自身の満腹度を🍖-100する",
    requireContribution: 45,
    skill: (timing) => {
      if (timing !== "before") return;
      changeStatusValue("hungry", -100);
    },
  },
  {
    id: 7,
    name: "筋トレ",
    description: "このラウンド中与えるマッスルダメージを2倍にする。",
    requireContribution: 50,
    skill: () => console.log(i, "ギフト8"),
  },
  {
    id: 8,
    name: "おなべのふた",
    description: "このラウンド中相手から受けるダメージを無効化する",
    requireContribution: 55,
    skill: () => console.log(i, "ギフト9"),
  },
  {
    id: 9,
    name: "福袋",
    description: "カードを6枚ドローする",
    requireContribution: 60,
    skill: (timing: string) => {
      if (timing !== "before") return;
      setHand();
    },
  },
  {
    id: 10,
    name: "早食い",
    description: "スピード🦶+2する",
    requireContribution: 65,
    skill: (timing) => {
      if (timing !== "before") return;
      changeSumCardsValue("priority", 2);
    }
  },
  {
    id: 11,
    name: "飯テロ",
    description: "このラウンド中相手はマッスルカードしか使えない",
    requireContribution: 70,
    skill:() => {
      console.log(i, "飯テロを実行しました");
    }
  },
];
export default allGifts;
