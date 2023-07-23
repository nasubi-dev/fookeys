import type { Mission } from "@/types";
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
      return field.filter((card) => card.company === "hanamie").length;
    },
  },
  // {
  //   id: 1,
  //   name: "マーケティングhanamie★★",
  //   description: "hanamieのカードを合計7枚使用する。",
  //   reward: 40,
  //   goalAchievement: 7,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "hanamie").length;
  //   },
  // },
  // {
  //   id: 2,
  //   name: "マーケティングnorma★",
  //   description: "normaのカードを合計5枚使用する。",
  //   reward: 30,
  //   goalAchievement: 5,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "norma").length;
  //   },
  // },
  // {
  //   id: 2,
  //   name: "マーケティングnorma★★",
  //   description: "normaのカードを合計7枚使用する。",
  //   reward: 40,
  //   goalAchievement: 7,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "norma").length;
  //   },
  // },
  // {
  //   id: 3,
  //   name: "マーケティングbianca★",
  //   description: "biancaのカードを合計5枚使用する。",
  //   reward: 30,
  //   goalAchievement: 5,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "bianca").length;
  //   },
  // },
  // {
  //   id: 3,
  //   name: "マーケティングbianca★★",
  //   description: "biancaのカードを合計7枚使用する。",
  //   reward: 40,
  //   goalAchievement: 7,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "bianca").length;
  //   },
  // },
  // {
  //   id: 4,
  //   name: "マーケティングbulbull★",
  //   description: "bulbullのカードを合計5枚使用する。",
  //   reward: 30,
  //   goalAchievement: 5,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "bulbull").length;
  //   },
  // },
  // {
  //   id: 4,
  //   name: "マーケティングbulbull★★",
  //   description: "bulbullのカードを合計7枚使用する。",
  //   reward: 40,
  //   goalAchievement: 7,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "bulbull").length;
  //   },
  // },
  // {
  //   id: 5,
  //   name: "マーケティングgaldaybee★",
  //   description: "galdaybeeのカードを合計5枚使用する。",
  //   reward: 30,
  //   goalAchievement: 5,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "galdaybee").length;
  //   },
  // },
  // {
  //   id: 5,
  //   name: "マーケティングgaldaybee★★",
  //   description: "galdaybeeのカードを合計7枚使用する。",
  //   reward: 40,
  //   goalAchievement: 7,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "galdaybee").length;
  //   },
  // },
  // {
  //   id: 6,
  //   name: "マーケティングrapidpot★",
  //   description: "rapidpotのカードを合計5枚使用する。",
  //   reward: 30,
  //   goalAchievement: 5,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "rapidpot").length;
  //   },
  // },
  // {
  //   id: 6,
  //   name: "マーケティングrapidpot★★",

  //   description: "rapidpotのカードを合計7枚使用する。",
  //   reward: 40,
  //   goalAchievement: 7,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "rapidpot").length;
  //   },
  // },
  // {
  //   id: 7,
  //   name: "マーケティングunlimit★",
  //   description: "unlimitのカードを合計5枚使用する。",
  //   reward: 30,
  //   goalAchievement: 5,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "unlimit").length;
  //   },
  // },
  // {
  //   id: 7,
  //   name: "マーケティングunlimit★★",
  //   description: "unlimitのカードを合計7枚使用する。",
  //   reward: 40,
  //   goalAchievement: 7,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.company === "unlimit").length;
  //   },
  // },
  // {
  //   id: 8,
  //   name: "セール品★",
  //   description: "消費期限が🦠3以下のカードを5枚以上使用する。",
  //   reward: 35,
  //   goalAchievement: 5,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.waste <= 3).length;
  //   },
  // },
  // {
  //   id: 8,
  //   name: "セール品★★",
  //   description: "消費期限が🦠3以下のカードを8枚以上使用する。",
  //   reward: 45,
  //   goalAchievement: 8,
  //   nowAchievement: 0,
  //   checker: (sumFields, field) => {
  //     if (field === undefined) return;
  //     return field.filter((card) => card.waste <= 3).length;
  //   },
  // },
  {
    id: 9,
    name: "食べきり",
    description: "手札を0枚にする。",
    reward: 35,
    goalAchievement: 1,
    nowAchievement: 0,
    checker: (sumFields, field, hand) => {
      if (hand === undefined) return;
      console.log(hand.length);
      return hand.length === 0 ? 1 : 0;
    },
  },
];
export default allMissions;
