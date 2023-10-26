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
    <div v-if="dropDown" class="fixed z-10 w-48 p-2 bg-white rounded  transform -translate-y-20 ">
      <p class="flex flex-row-reverse mb-1 font-bold  text-gray-900">
        <span class="ml-auto">{{ "🪙 " + allGifts[gift]?.requireContribution }}</span>
        <span>{{ allGifts[gift]?.name }}</span>
      </p>
      <p class="whitespace-pre-wrap  text-gray-900">{{ allGifts[gift]?.description }}</p>
    </div>
    <VDuringPress :onKeyDown="onLongPressCallbackHook" :onKeyUp="onKeyUpCallbackHook" :delay="500">
      <img :src="`/img/gifts/${gift}.png`" class="" />
    </VDuringPress>
  </div>
</template>