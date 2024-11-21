<script setup lang="ts">
import { ref } from "vue";
import { useSound } from "@vueuse/sound";
import { popUp } from "@/assets/sounds";
import type { Card } from "@/types";
import VDuringPress from "./VDuringPress.vue";

defineProps<{
  card: Card;
  size: "normal" | "big";
  state?: boolean;
}>();

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
  <div class="min-w-[7rem]">
    <div v-if="dropDown" class="bg-white rounded w-56 z-20 mx-3 p-2 fixed text-gray-900 text-left"
      :class="[card.description ? ' -translate-y-16  z-20' : '-translate-y-10', state ? `` : `max-w-fit`]">
      <p class="font-bold">{{ card.company + " : " + card.name }}</p>
      <p>{{ card.description }}</p>
    </div>
    <div class="relative">
      <VDuringPress :onKeyDown="onLongPressCallbackHook" :onKeyUp="onKeyUpCallbackHook" :delay="250">
        <img :src="`/img/companys/${card.company}.png`" class="min-w-[7rem]" />
        <div class="overText min-w-[7rem]">
          <p v-if="card.waste" class="font-bold text-center transform select-none" :class="[
            size === 'normal' ? `text-[max(2vw,1rem)] -translate-x-[max(2.6vw,210%)] translate-y-[min(2.2vw,500px)] ` : `text-[max(2vw,1rem)] -translate-x-[280%] translate-y-[140%]`,
            card.waste === 1 ? `-translate-x-[380%]` : null,
          ]">
            {{ card.waste }}
          </p>
          <img v-if="card.waste" :src="`/img/foods/${card.id}.png`" class="transform"
            :class="size === 'normal' ? `-translate-x-[10%]` : `-translate-x-[10%] translate-y-[10%]`" />

          <div class="flex font-black text-border-thin transform select-none"
            :class="size === 'normal' ? `text-[max(1vw,0.5rem)] -translate-x-[10%]  -translate-y-[60%]` : `text-lg -translate-x-[10%] -translate-y-[40%]`">
            <p v-if="card.hungry !== undefined && card.id !== 0">{{ "🍖" + card.hungry }}</p>
            <p v-if="card.atk">{{ "💪" + card.atk }}</p>
            <p v-if="card.def">{{ "🛡" + card.def }}</p>
            <p v-if="card.tech">{{ "⚡️" + card.tech }}</p>
            <p v-if="card.heal">{{ "💖" + card.heal }}</p>
          </div>
        </div>
        <div v-if="card.description && card.id !== 0" class="absolute"
          :class="size === 'normal' ? `top-5 right-5 w-[max(2vw,30px)]` : `top-7 right-8 w-8`">
          <img :src="`/img/showSpecial/${card.company}.png`" class="absolute" />
        </div>
      </VDuringPress>
    </div>
  </div>
</template>
