<script setup lang="ts">
import { onMounted } from "vue";
import { getPlayerData } from "@/server/useMatchMaking";
import { useBattle } from "@/server/useBattle";
import { usePlayerStore, useGameStore } from "@/store";
import PlayerData from "@/components/playerData.vue";
import Status from "@/components/status.vue";

const playerStore = usePlayerStore();
const gameStore = useGameStore();

//入場したらPlayer型としてIDが保管される
onMounted(async () => {
  const playerData = (await getPlayerData(playerStore.id)).data;
  if (!playerData) {
    console.log("playerData is null");
    return;
  }
  playerStore.idGame = playerData.idGame;
  playerStore.idEnemy = playerData.idEnemy;
  const gameData = await useBattle(playerStore.idGame);
  gameStore.turn = gameData.turn; //!まとめ方がわからない
  gameStore.players = gameData.players;
  playerStore.id !== gameStore.players[0].id ? (playerStore.num = 0) : (playerStore.num = 1);
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Battle</h1>
    {{ playerStore.num }}
    <p class="text-sm font-medium text-gray-900 truncate">turn:{{ gameStore.turn }}</p>
    <Status :id="0" />
    <PlayerData />
  </div>
</template>
