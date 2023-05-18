<script setup lang="ts">
import { onMounted } from "vue";
import { useBattle, setHand, setMissions, watchTurnEnd } from "@/server/useBattle";
import { playerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";
import Status from "@/components/status.vue";
import Cards from "@/components/cards.vue";
import Mission from "@/components/mission.vue";

const { turn, players, missions } = storeToRefs(gameStore);
const { id, sign, hand, field } = storeToRefs(playerStore);
const { fieldClick, handClick } = playerStore;
//入場したらPlayer型としてIDが保管される
onMounted(async () => {
  await useBattle();
  sign.value = id.value === players.value[0] ? 0 : 1;
  await setHand();
  await setMissions();
  console.log("gameStore: ", players.value, turn.value, missions.value);
  console.log("hand: ", hand.value);
  console.log("missions: ", missions.value);
});
//ターンを終了時
const turnEnd = async () => {
  console.log("turnEnd");
  Promise.all([
    await watchTurnEnd(),
  ]).then(() => {
    //処理が終了したらFieldを削除
    // fieldDelete();
  });
};

</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center h-screen">
      <h1>Battle</h1>
      <p class="text-sm font-medium text-gray-900 truncate">turn:{{ turn }}</p>
      {{ "Player: " + (playerStore.sign + 1) }}
      <div class="max-w-7xl mx-auto">
        <div>
          <h1>Mission</h1>
          <Mission :missions="missions" />
        </div>
        <div>
          <h1>Status</h1>
          <Status :id="sign" />
        </div>
        <div>
          <h1>Field</h1>
          <Cards :cards="field" @sendText="fieldClick" />
        </div>
        <div class="flex flex-col justify-end">
          <button @click="turnEnd">ターン終了ボタン</button>
        </div>
        <div>
          <h1>Hand</h1>
          <Cards :cards="hand" @sendText="handClick" />
        </div>
      </div>
    </div>
  </div>
</template>
