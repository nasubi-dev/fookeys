import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { e, s, i } from "@/log";
import type { PlayerData, Mission, GameData } from "@/types";

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
  const sumAllField = computed(() => {
    let sumAllField = {
      hungry: 0,
      waste: 0,
      pow: 0,
      tech: 0,
      def: 0,
    };
    data.value.field.forEach((card) => {
      sumAllField.hungry += card.hungry ? card.hungry : 0;
      sumAllField.waste += card.waste ? card.waste : 0;
      sumAllField.pow += card.pow ? card.pow : 0;
      sumAllField.tech += card.tech ? card.tech : 0;
      sumAllField.def += card.def ? card.def : 0;
    });
    return sumAllField;
  });
  //?function/actions
  //Handのカードをクリックしたら、そのカードをFieldに出す
  const clickHand = (index: number) => {
    const { field, hand } = data.value;
    field.push(hand[index]);
    hand.splice(index, 1);
    console.log(i, "handClick: ", index, "field: ", field);
  };
  //Fieldのカードをクリックしたら、そのカードをHandに戻す
  const clickField = (index: number) => {
    const { field, hand } = data.value;
    hand.push(field[index]);
    field.splice(index, 1);
    console.log(i, "fieldClick: ", index, "hand: ", hand);
  };
  //ターン終了時に、Fieldのカードを捨てる
  const deleteField = () => {
    const { field } = data.value;
    field.splice(0, field.length);
    console.log(i, "fieldDelete: ", "field: ", field.every.name);
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
  const game= ref<GameData>({
    turn: 1,
    players: [],
    missions: [],
  });
  const turn = ref(1);
  const players = ref<string[]>([]);
  const missions = ref<Mission[]>([]);
  //?Computed/Getter
  const newGame = computed(() => {
    const newGame = {
      turn: turn.value,
      players: players.value,
      missions: missions.value,
    } as GameData;
    return newGame;
  });
  ///?function/actions

  return { game,turn, players, missions, newGame };
});

export { usePlayerStore, useGameStore };
