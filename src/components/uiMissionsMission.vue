<script setup lang="ts">
import { ref, watch } from "vue";
import { useSound } from "@vueuse/sound";
import { popUp, success } from "@/assets/sounds";
import type { Mission } from "@/types";
import VDuringPress from "./VDuringPress.vue";
import missionImg from "@/assets/img/ui/mission.png";
import bg from "@/assets/img/ui/42x.png";


const p = defineProps<{ mission: Mission }>();

const usePopUp = useSound(popUp);
const useSuccess = useSound(success, { volume: 0.3 });

watch(
  () => p.mission.achieved,
  (newVal) => {
    if (newVal) useSuccess.play();
  }
);

const dropDown = ref(false);
const onLongPressCallbackHook = (): void => {
  console.log("longPress");
  dropDown.value = true;
  usePopUp.play();
};
const onKeyUpCallbackHook = (): void => {
  dropDown.value = false;
};
</script>

<template>
  <div style="user-select: none">
    <div v-if="dropDown" class="fixed w-[max(15vw,190px)]  z-10 text-left transform -translate-y-16 -translate-x-20">
      <div class="absolute w-[max(15vw,190px)]">
        <img :src="bg" class="z-20 absolute w-[max(15vw,190px)]" />
        <div class="z-20 p-4 w-[max(15vw,190px)] text-ellipsis  whitespace-pre-wrap absolute">
          {{ mission.description }}
        </div>
      </div>
    </div>

    <div class="relative">
      <VDuringPress :onKeyDown="onLongPressCallbackHook" :onKeyUp="onKeyUpCallbackHook" :delay="250">
        <img :src="missionImg" class="w-[260px]" />
        <div class="overText">
          <span class="flex flex-row-reverse w-full pl-5 pr-4 text-sm text-gray-900">
            <span class="ml-auto font-bold">{{ "🪙" + mission.reward }}</span>
            <span class="ml-1 font-bold">{{ mission.name }}</span>
          </span>
          <div class="gauge w-10/12">
            <span v-if="mission.achieved" class="text-sm font-bold text-gray-900 mr-2">✔</span>
            <span v-else class="text-sm font-bold text-white fixed">{{ mission.nowAchievement + "/" +
              mission.goalAchievement }}</span>
            <div class="bar" :style="{ width: 100 - (mission.nowAchievement / mission.goalAchievement) * 100 + '%' }">
            </div>
          </div>
        </div>
      </VDuringPress>
    </div>
  </div>
</template>
