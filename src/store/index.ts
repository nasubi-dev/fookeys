import { createPinia, defineStore } from "pinia";
import type { MatchStatus, Player, PlayerData, GameData } from "@/types";

class PlayerDataStore implements PlayerData {
  id = "";
  sign = false;
  name = "";
  idEnemy = "";
  idGame = "";
  match: MatchStatus = "nothing";
  character = 0;
  gift = 0;
}

const usePlayerStore = defineStore("playerData", {
  state: () => new PlayerDataStore(),
});

class GameDataStore implements GameData {
  turn = 1;
  players: [Player, Player] = [
    {
      id: "",
      name: "",
      character: 0,
      gift: 0,
      check: false,
      hand: [],
      board: [],
      status: { hp: 600, hungry: 0, contribution: 0, priority: 0 },
    },
    {
      id: "",
      name: "",
      character: 0,
      gift: 0,
      check: false,
      hand: [],
      board: [],
      status: { hp: 600, hungry: 0, contribution: 0, priority: 0 },
    },
  ];
}

const useGameStore = defineStore("gameData", {
  state: () => new GameDataStore(),
});

const pinia = createPinia();
export { usePlayerStore, useGameStore, pinia };
