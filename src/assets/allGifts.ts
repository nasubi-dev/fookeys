import { e, s, i } from "@/log";
import type { Gift } from "@/types";
import {
  changeAllHand,
  changeHandValue,
  changeStatusValue,
  setHand,
  deleteAllRottenCard,
  changeSumCardsValue,
} from "@/server/useShopUtils";

const allGifts: Gift[] = [
  {
    id: 0,
    name: "マジック",
    description: "手札を全て入れ替える",
    requireContribution: 15,
    skill: () => {
      changeAllHand();
    },
  },
  {
    id: 1,
    name: "つまみ食い",
    description: "手札のカードの満腹度を🍖-10する",
    requireContribution: 20,
    skill: () => {
      changeHandValue("hungry", -10);
    },
  },
  {
    id: 2,
    name: "冷凍保存",
    description: "手札の消費期限を🦠+1する",
    requireContribution: 35,
    skill: () => {
      changeHandValue("waste", 1);
    },
  },
  {
    id: 3,
    name: "ドクターストップ",
    description: "このラウンド中相手は1枚しかカードを使用できない",
    requireContribution: 25,
    skill: () => {},
  },
  {
    id: 4,
    name: "栄養バランス",
    description: "HPを❤️+150する",
    requireContribution: 45,
    skill: () => {
      changeStatusValue("hp", 150);
    },
  },
  {
    id: 5,
    name: "リサイクル",
    description: "腐ったカードを手札から全部消す",
    requireContribution: 35,
    skill: () => {
      const num = deleteAllRottenCard();
      changeStatusValue("maxHungry", num * 20);
    },
  },
  {
    id: 6,
    name: "リサーチ",
    description: "自身の満腹度を🍖-100する",
    requireContribution: 45,
    skill: () => {
      changeStatusValue("hungry", -100);
    },
  },
  {
    id: 7,
    name: "筋トレ",
    description: "このラウンド中マッスルダメージを2倍にする",
    requireContribution: 50,
    skill: () => {},
  },
  {
    id: 8,
    name: "おなべのふた",
    description: "このラウンド中防御を🛡+999する",
    requireContribution: 55,
    skill: () => {
      changeSumCardsValue("def", 999);
    },
  },
  {
    id: 9,
    name: "福袋",
    description: "カードを6枚ドローする",
    requireContribution: 60,
    skill: () => {
      setHand();
    },
  },
  {
    id: 10,
    name: "早食い",
    description: "このラウンド中使用カード枚数分スピードを🦶+1する",
    requireContribution: 65,
    skill: () => {
      changeSumCardsValue("priority", 2);
    },
  },
  {
    id: 11,
    name: "飯テロ",
    description: "このラウンド中相手はマッスルカードしか使えない",
    requireContribution: 70,
    skill: () => {},
  },
];
export default allGifts;
