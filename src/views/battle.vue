<script setup lang="ts">
import { onMounted } from "vue";
import { getPlayerData } from "@/server/useMatchMaking";
import { useBattle } from "@/server/useBattle";
import { usePlayerStore, useGameStore } from "@/store";
import Status from "@/components/status.vue";

const playerStore = usePlayerStore();
const gameStore = useGameStore();

//入場したらPlayer型としてIDが保管される
onMounted(async () => {
  const keep = playerStore.id;
  (playerStore.$state = await getPlayerData(playerStore.id)),
    (playerStore.id = keep),
    (gameStore.$state = await useBattle(playerStore.idGame)),
    playerStore.id == gameStore.players[0].id ? (playerStore.num = 1) : (playerStore.num = 0);
  //animation?????
});
</script>

<template>
  <div>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Battle</h1>
    {{ playerStore.num + 1 }}
    <p class="text-sm font-medium text-gray-900 truncate">turn:{{ gameStore.turn }}</p>
    <Status :id="playerStore.num" />
  </div>
  
</div>
</template>
