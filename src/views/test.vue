<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import type { Ref } from "vue";
import { e, s, i } from "@/log";
import type { Mission } from "@/types";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { now } from "@vueuse/core";

//storeの参照
const { pushHand, popHand } = playerStore;
const { id, player, cardLock } = storeToRefs(playerStore);
const { name, hand, status } = toRefs(player.value);

const advanceAchievement = () => {
  console.log(i, "進捗を加算");
  testMission.value.nowAchievement++;
};

const judgeAchieved = () => {
  console.log(i, "報酬を加算");
  status.value.contribution += testMission.value.reward;
}

const testMission = ref({
  id: 0,
  name: "test",
  description: "test",
  reward: 100,
  goalAchievement: 2,
  nowAchievement: 0,
  checker: () => {
    console.log(i, "testMission");
    //一回しかMission達成できないように
    if (testMission.value.nowAchievement < testMission.value.goalAchievement) {
      advanceAchievement();
      if (testMission.value.goalAchievement === testMission.value.nowAchievement) judgeAchieved();
    } else console.log(i, "すでに達成済み");
  },
})

</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Test</h1>
    <div>
      <p class="text-sm font-medium text-gray-900 truncate">id:{{ id }}</p>
      <p class="text-sm font-medium text-gray-900 truncate">name:{{ name }}</p>
    </div>

    {{ testMission }}
    {{ status.contribution }}

    <button @click="testMission.checker">finishBattle</button>
  </div>
</template>
