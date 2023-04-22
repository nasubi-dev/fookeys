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
  if (playerData) {
    playerStore.idGame = playerData.idGame;
    const gameData = await useBattle(playerStore.idGame);
  gameStore.turn = gameData.turn; //!まとめ方がわからない
    gameStore.players = gameData.players;
    console.log("gameData: ", gameData);
  }
});

//表示するデータをplayer1,2で分ける
//onSnapshotの中でGameのplayer1,2の順番を入れ替える?
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Battle</h1>
    <p class="text-sm font-medium text-gray-900 truncate">turn:{{ gameStore.turn }}</p>
    <Status />
    <PlayerData />
  </div>
</template>
