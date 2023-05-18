import { ref, computed } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import type { MatchStatus, PlayerSign, PlayerData, Status, Card, Character, Gift, Mission, GameData } from "@/types";

const usePlayerStore = defineStore("playerData", () => {
  //?Const/State
  const id = ref("");
  const idEnemy = ref("");
  const idGame = ref("");
  const name = ref("");
  const match: Ref<MatchStatus> = ref("nothing");
  const check = ref(false);
  const sign: Ref<PlayerSign> = ref(0);
  const character: Ref<Character | null> = ref(null);
  const gift: Ref<Gift[]> = ref([]);
  const hand: Ref<Card[]> = ref([]);
  const field: Ref<Card[]> = ref([]);
  const status: Ref<Status> = ref({ hp: 0, hungry: 0, contribution: 0, priority: 0 });
  //?Computed/Getter
  const newPlayer = computed(() => {
    const newPlayer = {
      idEnemy: idEnemy.value,
      idGame: idGame.value,
      name: name.value,
      match: match.value,
      check: check.value,
      sign: sign.value,
      character: character.value,
      gift: gift.value,
      hand: hand.value,
      field: field.value,
      status: status.value,
    } as PlayerData;
    return newPlayer;
  });
  //?function/actions
  //Handのカードをクリックしたら、そのカードをFieldに出す
  const handClick = (index: number) => {
    console.log("handClick: ", index);
    field.value.push(hand.value[index]);
    hand.value.splice(index, 1);
    console.log("field: ", field.value);
  };
  //Fieldのカードをクリックしたら、そのカードをHandに戻す
  const fieldClick = (index: number) => {
    console.log("fieldClick: ", index);
    hand.value.push(field.value[index]);
    field.value.splice(index, 1);
    console.log("hand: ", hand.value);
  };
  //ターン終了時に、Fieldのカードを捨てる
  const fieldDelete= () => {
    console.log("fieldDelete");
    field.value.splice(0, field.value.length);
    console.log("field: ", field.value);
  };
  return {
    id,
    idEnemy,
    idGame,
    name,
    match,
    check,
    sign,
    character,
    gift,
    hand,
    field,
    status,
    newPlayer,
    handClick,
    fieldClick,
    fieldDelete,
  };
});

const useGameStore = defineStore("gameData", () => {
  //?Const/State
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

  return { turn, players, missions, newGame };
});

export { usePlayerStore, useGameStore };
