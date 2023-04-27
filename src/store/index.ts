import { createPinia, defineStore } from "pinia";
import type { MatchStatus, PlayerData, GameData, Card, Character, Gift, Mission } from "@/types";

class PlayerDataStore implements PlayerData {
  id = "";
  idEnemy = "";
  idGame = "";
  name = "";
  match: MatchStatus = "nothing";
  check = false;
  sign: 0 | 1 = 0;
  character: Character = { name: "", description: "", image: "", company: "" };
  gift: [Gift, Gift, Gift] = [
    { name: "", description: "", image: "" },
    { name: "", description: "", image: "" },
    { name: "", description: "", image: "" },
  ];
  hand: Card[] = [];
  board: Card[] = [];
  status = { hp: 0, hungry: 0, contribution: 0, priority: 0 };
}

const usePlayerStore = defineStore<string, PlayerDataStore>("playerData", {
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
