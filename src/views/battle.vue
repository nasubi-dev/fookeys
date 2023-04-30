<script setup lang="ts">
import { onMounted } from "vue";
import { useBattle, setHand, setMissions,cardCalc } from "@/server/useBattle";
import { playerStore, gameStore } from "@/main";
import Status from "@/components/status.vue";
import Cards from "@/components/cards.vue";
import Mission from "@/components/mission.vue";

//入場したらPlayer型としてIDが保管される
onMounted(async () => {
  await useBattle();
  playerStore.sign = playerStore.id === gameStore.players[0] ? 0 : 1;
  await setHand();
  await setMissions();
  console.log("gameStore: ", gameStore.players, gameStore.turn, gameStore.missions);
  console.log("hand: ", playerStore.hand);
  console.log("missions: ", gameStore.missions);
});
//ターンを終了時
const battleEnd = async () => {
  //cardCalcで計算
  await cardCalc();
  // await checkDeath();
  // await checkMission();
  // await turnEnd();
};

</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center h-screen">
      <h1>Battle</h1>
      <p class="text-sm font-medium text-gray-900 truncate">turn:{{ gameStore.turn }}</p>
      {{ "Player: " + (playerStore.sign + 1) }}
      <div class="max-w-7xl mx-auto">
        <div>
          <h1>Mission</h1>
          <Mission :missions="gameStore.missions" />
        </div>
        <div>
          <h1>Status</h1>
          <Status :id="playerStore.sign" />
        </div>
        <div>
          <h1>Field</h1>
          <Cards :cards="playerStore.field" @sendText="playerStore.fieldClick" />
        </div>
        <div class="flex flex-col justify-end">
          <button @click="battleEnd">ターン終了ボタン</button>
        </div>
        <div>
          <h1>Hand</h1>
          <Cards :cards="playerStore.hand" @sendText="playerStore.handClick" />
        </div>
      </div>
    </div>
  </div>
</template>
