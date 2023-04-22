<script setup lang="ts">
import PlayerData from "@/components/playerData.vue";
import { getPlayerData } from "@/server/useMatchMaking";
import { useBattle } from "@/server/useBattle";
import { usePlayerStore } from "@/store";

const playerStore = usePlayerStore();

//入場したらPlayer型としてIDが保管される
//Mountedに将来的に変える
async function battle() {
  const playerData = (await getPlayerData(playerStore.id)).data;
  if (playerData) {
    playerStore.idGame = playerData.idGame;
    playerStore.name = playerData.name;
    const battleData = await useBattle(playerStore.idGame);
    console.log(battleData);
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Battle</h1>
    <button @click="battle()">Battle</button>
    <PlayerData />
  </div>
</template>