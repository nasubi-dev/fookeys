<script setup lang="ts">
import { ref } from "vue";
import { useSound } from "@vueuse/sound";
import { popUp } from "@/assets/sounds";
import type { Card } from "@/types";
import VDuringPress from "./VDuringPress.vue";

defineProps<{
  card: Card;
  size: "normal" | "big"
  state?: boolean
}>()

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
  <div class="block">
    <div v-if="dropDown" class="bg-white rounded w-56 z-20 mx-3  p-2 fixed  text-gray-900 text-left"
      :class="[card.description ? ' -translate-y-16  z-20' : '-translate-y-10', state ? `` : `max-w-fit`]">
      <p class="font-bold">{{ card.company + " : " + card.name }}</p>
      <p>{{ card.description }}</p>
    </div>
    <div class="overCard">
      <VDuringPress :onKeyDown="onLongPressCallbackHook" :onKeyUp="onKeyUpCallbackHook" :delay="250">
        <img :src="`/img/companys/${card.company}.png`" />
        <div class="overText">
          <p v-if="card.waste" class="font-bold transform select-none"
            :class="size === 'normal' ? `text- -translate-x-[290%] translate-y-[90%] ` : `text-2xl -translate-x-[280%] translate-y-[110%]`">
            {{ card.waste }}
          </p>
          <img v-if="card.waste" :src="`/img/foods/${card.id}.png`" class="transform" :class="size==='normal'?`-translate-x-[10%] translate-y-[10%]`:`-translate-x-[10%] translate-y-[10%]`" />

          <div class="flex font-bold text-border-thin transform select-none"
            :class="size === 'normal' ? `text-xs -translate-x-[10%]  -translate-y-[60%]` : `text-lg -translate-x-[10%] -translate-y-[40%]`">
            <p v-if="card.hungry !== undefined && card.id !== 0">{{ "🍖" + card.hungry }} </p>
            <p v-if="card.atk">{{ "💪" + card.atk }}</p>
            <p v-if="card.def">{{ "🛡" + card.def }}</p>
            <p v-if="card.tech">{{ "⚡️" + card.tech }}</p>
            <p v-if="card.heal">{{ "💖" + card.heal }}</p>
          </div>

        </div>
        <div v-if="card.description && card.id !== 0" class="absolute"
          :class="size === 'normal' ? `top-5 right-5 w-5` : `top-7 right-8 w-8`">
          <img :src="`/img/showSpecial/${card.company}.png`" class=" absolute" />
        </div>
      </VDuringPress>
    </div>
  </div>
</template>