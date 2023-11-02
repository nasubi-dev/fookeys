<script setup lang="ts">
import { ref } from "vue";
import { useSound } from "@vueuse/sound";
import { popUp } from "@/assets/sounds";
import VDuringPress from "./VDuringPress.vue";
import allGifts from "@/assets/allGifts";

defineProps<{ gift: number }>();

const usePopUp = useSound(popUp);

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
  <div class="mt-auto mx-1">
    <div v-if="dropDown" class="bg-white rounded fixed z-20 p-2 w-48 whitespace-pre-wrap transform -translate-y-20">
      <div class="flex flex-row mb-1 font-bold  text-gray-900">
        <p>{{ allGifts[gift]?.name }}</p>
        <p class="ml-auto">{{ "🪙 " + allGifts[gift]?.requireContribution }}</p>
      </div>
      <p>{{ allGifts[gift]?.description }}</p>
    </div>
    <VDuringPress :onKeyDown="onLongPressCallbackHook" :onKeyUp="onKeyUpCallbackHook" :delay="250">
      <img :src="`/img/gifts/${gift}.png`" class="" />
    </VDuringPress>
  </div>
</template>