<script setup lang="ts">
import { ref } from "vue";
import VDuringPress from "./VDuringPress.vue";
import allGifts from "@/assets/allGifts";

defineProps<{
  gift: number;
}>();

const dropDown = ref(false);
const onLongPressCallbackHook = (): void => {
  console.log("longPress");
  dropDown.value = true;
};
const onKeyUpCallbackHook = (): void => {
  dropDown.value = false;
};

</script>

<template>
  <div class="mt-auto mx-3" style="user-select: none;">
    <div v-if="dropDown" class="bg-white rounded fixed z-10 p-2 text-left transform -translate-y-16">
      <p>{{ allGifts[gift]?.name + "🪙" + allGifts[gift]?.requireContribution }}</p>
      <p>{{ allGifts[gift]?.description }}</p>
    </div>
    <div class="overCard">
      <VDuringPress :onKeyDown="onLongPressCallbackHook" :onKeyUp="onKeyUpCallbackHook" :delay="500">
        <div class="rounded-full bg-white p-6"></div>
        <img :src="`/img/gifts/${gift}.png`" class="overText" />
      </VDuringPress>
    </div>
  </div>
</template>