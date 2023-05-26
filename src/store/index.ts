import { ref, computed } from "vue";
import { e, s, i } from "@/log";
import type { PlayerData, GameData, sumCardsField, Card } from "@/types";
import { defineStore } from "pinia";

const usePlayerStore = defineStore("playerData", () => {
  //?Const/State
  const id = ref("");
  const player = ref<PlayerData>({
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
  const sumCardsField = computed<sumCardsField>(() =>
    player.value.field.reduce(
      (sum: sumCardsField, card: Card) => {
        sum.waste += card.waste;
        sum.hungry += card.hungry;
        sum.pow += card.pow ?? 0;
        sum.def += card.def ?? 0;
        sum.tech += card.tech ?? 0;
        return sum;
      },
      { waste: 0, hungry: 0, pow: 0, def: 0, tech: 0 }
    )
  );
  //?function/actions
  //Handのカードをクリックしたら、そのカードをFieldに出す
  const pushHand = (index: number): void => {
    const { field, hand } = player.value;
    field.push(hand[index]);
    console.log(i, "pushHand: ", index, "field: ", field);
  };
  //Fieldのカードをクリックしたら、そのカードをHandに戻す
  const popHand = (index: number, card: Card): void => {
    const { field } = player.value;
    for (let i = field.length; i >= 0; i--) {
      if (field[i] === card) {
        field.splice(i, 1);
        break;
      }
    }
    console.log(i, "popHand: ", index, "field: ", field);
  };
  //ターン終了時に、Fieldのカードを捨てる
  const deleteField = (): void => {
    const { field } = player.value;
    field.splice(0, field.length);
    console.log(
      i,
      "fieldDelete: ",
      "field: ",
      field.map((card) => card.name)
    );
  };
  return {
    id,
    player,
    sumCardsField,
    pushHand,
    popHand,
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
