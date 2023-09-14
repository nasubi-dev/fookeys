<script setup lang="ts">
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import type { Card } from "@/types";
import UiCard from "./uiCard.vue";

const { cardLock } = storeToRefs(playerStore);

defineProps<{
  cards: Card[];
  value: number | string;
  after: number | string;
}>();

</script>
<template>
  <transition appear enter-from-class="translate-y-[-150%] opacity-0" leave-to-class="translate-y-[150%] opacity-0"
    leave-active-class="transition duration-300" enter-active-class="transition duration-300" mode="out-in">
    <div class="overCard flex justify-start">
      <div
        v-for="card in (after === 'donate' ? cards : (cards.map((card) => { if (card.attribute === after) { return card } })))"
        :key="card?.id">
        <div v-if="card" class="cardSize" style="width: 15vw;">
          <UiCard :card="card" />
        </div>
      </div>

      <div v-if="cardLock" class="overText">
        <transition-group appear enter-from-class="translate-y-[-150%] opacity-0"
          leave-to-class="translate-y-[150%] opacity-0" leave-active-class="transition duration-300"
          enter-active-class="transition duration-300">
          <div v-if="after === 'hungry'" class=" text-3xl font-bold">{{ value ? "行動不能✖" : "行動可能✔" }}</div>
          <div v-if="after === 'donate' && value" class=" text-5xl font-bold text-fuchsia-600">{{ "🪙" + value }}</div>
          <div v-if="after === 'def' && value" class=" text-5xl font-bold text-fuchsia-600">{{ "🛡:" + value }}</div>
          <div v-if="after === 'atk' && value" class=" text-5xl font-bold text-fuchsia-600">{{ "⚔:" + value }}</div>
          <div v-if="after === 'tech' && value" class="text-5xl font-bold text-fuchsia-600">{{ "🏹:" + value }}</div>
          <!-- <div v-if="after === 'hungry' || 'sup'" class=" text-lg font-bold text-fuchsia-600">????????????????????</div> -->
        </transition-group>
      </div>
    </div>
  </transition>
</template>
