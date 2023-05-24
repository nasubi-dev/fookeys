import { ref, computed } from "vue";
import { e, s, i } from "@/log";
import type { PlayerData, GameData } from "@/types";
import { defineStore } from "pinia";

const usePlayerStore = defineStore("playerData", () => {
  //?Const/State
  const id = ref("");
  const data = ref<PlayerData>({
    idEnemy: "",
    idGame: "",
    name: "",
    match: "nothing",
    check: false,
    sign: 0,
    character: null,
    gift: [],
    hand: [],
    field: [],
    status: {
      hp: 0,
      hungry: 0,
      contribution: 0,
      priority: 0,
    },
  });
  //?Computed/Getter
  //Fieldに出ているカードの値を合計する
  const sumAllField = computed<{
    waste: number;
    hungry: number;
    pow: number;
    def: number;
    tech: number;
  }>(() =>
    data.value.field.reduce(
      (acc, cur) => {
        acc.waste += cur.waste;
        acc.hungry += cur.hungry;
        acc.pow += cur.pow || 0;
        acc.def += cur.def || 0;
        acc.tech += cur.tech || 0;
        return acc;
      },
      { waste: 0, hungry: 0, pow: 0, def: 0, tech: 0 }
    )
  );
  //?function/actions
  //Handのカードをクリックしたら、そのカードをFieldに出す
  const clickHand = (index: number): void => {
    const { field, hand } = data.value;
    field.push(hand[index]);
    hand.splice(index, 1);
    console.log(i, "handClick: ", index, "field: ", field);
  };
  //Fieldのカードをクリックしたら、そのカードをHandに戻す
  const clickField = (index: number): void => {
    const { field, hand } = data.value;
    hand.push(field[index]);
    field.splice(index, 1);
    console.log(i, "fieldClick: ", index, "hand: ", hand);
  };
  //ターン終了時に、Fieldのカードを捨てる
  const deleteField = (): void => {
    const { field } = data.value;
    field.splice(0, field.length);
    console.log(i, "fieldDelete: ", "field: ", field.map((card) => card.name));
  };
  return {
    id,
    data,
    sumAllField,
    clickHand,
    clickField,
    deleteField,
  };
});

const useGameStore = defineStore("gameData", () => {
  //?Const/State
  const game = ref<GameData>({
    turn: 1,
    players: [],
    missions: [],
  });
  //?Computed/Getter
  ///?function/actions

  return { game };
});

export { usePlayerStore, useGameStore };
