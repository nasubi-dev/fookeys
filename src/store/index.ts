import { ref } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import type { MatchStatus, PlayerSign, Status, Card, Character, Gift, Mission } from "@/types";

const usePlayerStore = defineStore("playerData", () => {
  const id = ref("");
  const idEnemy = ref("");
  const idGame = ref("");
  const name = ref("");
  const match: Ref<MatchStatus> = ref("nothing");
  const check = ref(false);
  const sign: Ref<PlayerSign> = ref(0);
  const character: Ref<Character> = ref({ name: "", description: "", image: "", company: "" });
  const gift: Ref<Gift[]> = ref([
    { name: "", description: "", image: "" },
    { name: "", description: "", image: "" },
    { name: "", description: "", image: "" },
  ]);
  const hand: Ref<Card[]> = ref([]);
  const board: Ref<Card[]> = ref([]);
  const status: Ref<Status> = ref({ hp: 0, hungry: 0, contribution: 0, priority: 0 });

  function setPlayerID(newID: string) {
    id.value = newID;
    console.log("test", id.value);
  }
  // function updatePlayerName(newName: string) {
  //   name.value = newName;
  //   console.log(name.value);
  // }

  return { id, idEnemy, idGame, name, match, check, sign, character, gift, hand, board, status, setPlayerID };
});

const useGameStore = defineStore("gameData", () => {
  const turn = ref(1);
  const players = ref<string[]>([]);
  const missions = ref<Mission[]>([]);

  return { turn, players, missions };
});

const useTestStore = defineStore("test", () => {
  const test = ref("test");
  function updateTest() {
    test.value = "updated";
    console.log(test.value);
  }
  return { test, updateTest };
});

export { usePlayerStore, useGameStore, useTestStore };
