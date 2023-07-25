<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { e, s, i } from "@/log";
import type { Mission } from "@/types";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { drawCard } from "@/server/useShopUtils";

//storeの参照
const { pushHand, popHand } = playerStore;
const { id, player, cardLock } = storeToRefs(playerStore);
const { name, hand, status } = toRefs(player.value);



</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Test</h1>
    <div>
      <p class="text-sm font-medium text-gray-900 truncate">id:{{ id }}</p>
      <p class="text-sm font-medium text-gray-900 truncate">name:{{ name }}</p>
    </div>
    <div>
      <button @click="hand.push(drawCard())">drawCard</button>
      <div v-for="card in hand" :key="card.id" class="text-xs flex justify-start">
        <img v-if="hand[0]" :src="`/img/companysBack/${card.company}.png`" class=" w-14 h-14" />
      </div>
    </div>
  </div>
</template>
