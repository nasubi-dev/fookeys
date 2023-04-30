import { ref, computed } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import type { MatchStatus, PlayerSign, PlayerData, Status, Card, Character, Gift, Mission, GameData, Result } from "@/types";

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
  const result = computed(() => {
    const result = {
      pow: 0,
      def: 0,
      tech: 0,
      waste: 0,
      hungry: 0,
    } as Result;
    return result;
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
  const sumFieldValue = (card: Card) => {
    result.value.pow += card.pow ? card.pow : 0;
    result.value.def += card.def ? card.def : 0;
    result.value.tech += card.tech ? card.tech : 0;
    result.value.waste += card.waste ? card.waste : 0;
    result.value.hungry += card.hungry ? card.hungry : 0;
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
    result,
    handClick,
    fieldClick,
    sumFieldValue,
  };
});

const useGameStore = defineStore("gameData", () => {
  //?Const/State
  const turn = ref(1);
  const players = ref<string[]>([]);
  const missions = ref<Mission[]>([]);
  const resultEnemy = ref({ pow: 0, def: 0, tech: 0, waste: 0, hungry: 0 });
  //?Computed/Getter
  const newGame = computed(() => {
    const newGame = {
      turn: turn.value,
      players: players.value,
      missions: missions.value,
      resultEnemy: resultEnemy.value,
    } as GameData;
    return newGame;
  });
  ///?function/actions

  return { turn, players, missions, resultEnemy, newGame };
});

export { usePlayerStore, useGameStore };
