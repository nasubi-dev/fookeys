import { ref, computed } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import { e, s, i } from "@/log";
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
  //Firestoreに保存するデータ
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
  //Fieldに出ているカードの値を合計する
  const sumAllField = computed(() => {
    let sumAllField = {
      hungry: 0,
      waste: 0,
      pow: 0,
      tech: 0,
      def: 0,
    };
    field.value.forEach((card) => {
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
    field.value.push(hand.value[index]);
    hand.value.splice(index, 1);
    console.log(i, "handClick: ", index, "field: ", field.value);
  };
  //Fieldのカードをクリックしたら、そのカードをHandに戻す
  const clickField = (index: number) => {
    hand.value.push(field.value[index]);
    field.value.splice(index, 1);
    console.log(i, "fieldClick: ", index, "hand: ", hand.value);
  };
  //ターン終了時に、Fieldのカードを捨てる
  const deleteField = () => {
    field.value.splice(0, field.value.length);
    console.log(i, "fieldDelete: ", "field: ", field.value);
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
    sumAllField,
    clickHand,
    clickField,
    deleteField,
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
