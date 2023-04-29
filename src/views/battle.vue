<script setup lang="ts">
import { onMounted } from "vue";
import { useBattle, setHand, setMissions } from "@/server/useBattle";
import { playerStore, gameStore } from "@/main";
import Status from "@/components/status.vue";
import Hand from "@/components/hand.vue";
import Mission from "@/components/mission.vue";

//入場したらPlayer型としてIDが保管される
onMounted(async () => {
  await useBattle();
  playerStore.id == gameStore.players[0] ? playerStore.sign = 0 : playerStore.sign = 1;
  console.log("gameStore: ", gameStore.players, gameStore.turn, gameStore.missions);
});

//この関数は最終的にonMountedに統合する
async function gameStart() {
  await setHand();
  console.log("hand: ", playerStore.hand);
  await setMissions();
  console.log("missions: ", gameStore.missions);
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Battle</h1>
    <p class="text-sm font-medium text-gray-900 truncate">turn:{{ gameStore.turn }}</p>
    {{ "Player" + (playerStore.sign + 1) }}
    <button @click="gameStart">gameStart</button>
    <div class="flex flex-1">
      <div class="w-1/3 flex items-center justify-center">
        <h1>Status</h1>
        <Status :id="playerStore.sign" />
      </div>
      <div class="w-1/3 flex items-center justify-center">
        <h1>Hand</h1>
        <Hand :hand="playerStore.hand" />
      </div>
      <div class="w-1/3 flex items-center justify-center">
        <h1>Mission</h1>
        <Mission :missions="gameStore.missions" />
      </div>
    </div>
  </div>
</template>
