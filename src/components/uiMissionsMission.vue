<script setup lang="ts">
import { ref } from "vue";
import type { Mission } from "@/types";
import VDuringPress from "./VDuringPress.vue";
import missionImg from '@/assets/img/ui/mission.png'

defineProps<{
  mission: Mission;
}>();

const dropDown = ref(false);
const onLongPressCallbackHook = (): void => {
  console.log("longPress");
  dropDown.value = true;
};
const onKeyUpCallbackHook = (): void => {
  console.log("keyUp");
  dropDown.value = false;
};
</script>

<template>
  <div style="user-select: none;">
    <div v-if="dropDown" class="bg-white rounded fixed z-10 p-2 text-left transform -translate-y-10">
      {{ mission.description }}
    </div>
    <div class="overCard">
    <VDuringPress :onKeyDown="onLongPressCallbackHook" :onKeyUp="onKeyUpCallbackHook" :delay="500">
      <img :src="missionImg" style="width: 25vw;" />
      <div class="overText">
        <span class="text-sm font-medium text-gray-900 mx-2 mt-5 w-max">
          {{ mission.name }}
          <span class="ml-auto">{{ "🪙" + mission.reward }}</span>
        </span>
        <div class="gauge">
          <span v-if="mission.achieved" class="text-sm font-medium text-gray-900 truncate mx-2">✔</span>
          <span v-else class=" text-white text-sm font-medium truncate mx-2 fixed">{{ mission.nowAchievement + "/" +
            mission.goalAchievement }}</span>
          <div class="bar" :style="{ width: (100 - ((mission.nowAchievement / mission.goalAchievement) * 100)) + '%' }">
          </div>
        </div>
      </div>
    </VDuringPress>
      </div>
  </div>
</template>
