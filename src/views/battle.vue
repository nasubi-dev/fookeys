<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getPlayerData } from "@/server/useMatchMaking";
import { useBattle, setHand } from "@/server/useBattle";
import { usePlayerStore, useGameStore } from "@/store";
import type { Hand } from "@/types";
import Status from "@/components/status.vue";
import HandCom from "@/components/hand.vue";
import Mission from "@/components/mission.vue";

//Collectionの参照
const playerStore = usePlayerStore();
const gameStore = useGameStore();

const keep = ref("");
const hand = ref(<Hand>[]);

//入場したらPlayer型としてIDが保管される
onMounted(async () => {
  keep.value = playerStore.id;
  playerStore.$state = await getPlayerData(playerStore.id);
  playerStore.id = keep.value;
  gameStore.$state = await useBattle(playerStore.idGame);
  playerStore.id == gameStore.players[0].id ? (playerStore.sign = 0) : (playerStore.sign = 1);
});

async function gameStart() {
  hand.value = await setHand(playerStore.idGame, playerStore.sign);
  //setMissionは最終的にturn開始時の関数に統合する
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
        <HandCom :hand="hand" />
      </div>
      <div class="w-1/3 flex items-center justify-center">
        <h1>Mission</h1>
      </div>
    </div>
  </div>
</template>
