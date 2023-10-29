<script setup lang="ts">
import { ref } from "vue";
import { useSound } from "@vueuse/sound";
import { popUp } from "@/assets/sounds";
import type { Card } from "@/types";
import VDuringPress from "./VDuringPress.vue";

defineProps<{ card: Card }>()

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
  <div class="block" style="user-select: none;">
    <div v-if="dropDown" class="bg-white rounded fixed z-10 p-2 text-gray-900 text-left"
      :class="card.description ? ' -translate-y-16' : '-translate-y-10'">
      <p class="font-bold">{{ card.company + " : " + card.name }}</p>
      <p>{{ card.description }}</p>
    </div>
    <div class="overCard">
      <VDuringPress :onKeyDown="onLongPressCallbackHook" :onKeyUp="onKeyUpCallbackHook" :delay="500">
        <img :src="`/img/companys/${card.company}.png`" />
        <div class="overText">

          <p v-if="card.waste" class="waste text-lg font-bold">{{ card.waste }}</p>

          <div class="info flex text-xs font-bold">
            <p v-if="card.hungry">{{ "🍖" + card.hungry }} </p>
            <p v-if="card.atk">{{ "⚔" + card.atk }}</p>
            <p v-if="card.def">{{ "🛡" + card.def }}</p>
            <p v-if="card.tech">{{ "🏹" + card.tech }}</p>
            <p v-if="card.heal">{{ "💖" + card.heal }}</p>
          </div>

        </div>
        <div v-if="card.description && card.id !== 0" class="absolute top-0 right-5">
          <div class="relative flex h-10 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full bg-yellow-300 opacity-25"></span>
            <span class="relative inline-flex h-10 w-3 bg-yellow-400"></span>
          </div>
        </div>
      </VDuringPress>
    </div>
  </div>
</template>