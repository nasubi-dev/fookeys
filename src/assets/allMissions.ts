import type { Mission, SumCards } from "@/types";
//!同じIDであれば、ミッションは同じものとして扱う ただし､内容は異なる
const allMissions: Mission[] = [
  {
    id: 0,
    name: "育ち盛り★",
    description: "合計🍖500分のカードを使用する。",
    reward: 25,
    goalAchievement: 500,
    nowAchievement: 0,
    checker: (sumFields) => {
      if (sumFields === undefined) return;
      return sumFields.hungry;
    },
  },
  {
    id: 0,
    name: "育ち盛り★★",
    description: "合計🍖600分のカードを使用する。",
    reward: 30,
    goalAchievement: 600,
    nowAchievement: 0,
    checker: (sumFields) => {
      if (sumFields === undefined) return;
      return sumFields.hungry;
    },
  },
  {
    id: 1,
    name: "マーケティングhanamie★",
    description: "hanamieのカードを合計5枚使用する。",
    reward: 30,
    goalAchievement: 5,
    nowAchievement: 0,
    checker: (sumFields, field) => {
      if (field === undefined) return;
      const hanamieCards = field.filter((card) => card.company === "hanamie").length;
      console.log("tttt",field.length);
      console.log("tttt",hanamieCards);
      return hanamieCards
    },
  },
  {
    id: 2,
    name: "セール品★",
    description: "消費期限が🦠3以下のカードを5枚以上使用する。",
    reward: 35,
    goalAchievement: 5,
    nowAchievement: 0,
    checker: (sumFields, field) => {
      if (field === undefined) return;
      return field.filter((card) => card.waste <= 3).length;
    },
  },
];
export default allMissions;
