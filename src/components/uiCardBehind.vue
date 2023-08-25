<script setup lang="ts">
import type { Card } from "@/types";

defineProps<{
  cards: Card[] | undefined;
  attribute?: 'sup' | 'atk' | 'def' | 'tech';
}>()

</script>
<template>
  <transition enter-from-class="translate-y-[-150%] opacity-0" leave-to-class="translate-y-[150%] opacity-0"
    leave-active-class="transition duration-300" enter-active-class="transition duration-300">
    <div v-if="attribute" class="flex justify-start">
      <div v-for="card in (cards?.map((card) => { if (card.attribute === attribute) { return card } }))" :key="card?.id">
        <div class="overCard">
          <img v-if="card" :src="`/img/companysBack/${card.company}.png`" class=" w-14 h-14" />
          <div class="overText">
            {{ card?.attribute }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-start ml-auto">
      <div v-for="card in cards" :key="card.id">
        <img :src="`/img/companysBack/${card.company}.png`" class=" w-14 h-14" />
      </div>
    </div>
  </Transition>
</template>