import { createPinia, defineStore } from "pinia";
import type { MatchStatus, PlayerData, GameData, Mission } from "@/types";

class PlayerDataStore implements PlayerData {
  id = "";
  sign: 0 | 1 = 0;
  name = "";
  idEnemy = "";
  idGame = "";
  match: MatchStatus = "nothing";
  character = 0;
  gift = 0;
  check = false;
  hand = [];
  board = [];
  status = { hp: 0, hungry: 0, contribution: 0, priority: 0 };
}

const usePlayerStore = defineStore("playerData", {
  state: () => new PlayerDataStore(),
});

class GameDataStore implements GameData {
  turn = 1;
  players: string[] = [];
  missions: Mission[] = [];
}

const useGameStore = defineStore("gameData", {
  state: () => new GameDataStore(),
});

const pinia = createPinia();
export { usePlayerStore, useGameStore, pinia };
