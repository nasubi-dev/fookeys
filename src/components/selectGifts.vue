<script setup lang="ts">
import { toRefs } from "vue";
import type { Gift } from "@/types";
import { storeToRefs } from "pinia";
import { playerStore } from "@/main";
import allGifts from "@/assets/allGifts";

const { player } = storeToRefs(playerStore);
const { gifts } = toRefs(player.value);

function selectGift(gift: Gift) {
  gifts.value.unshift(gift.id);
  gifts.value = gifts.value.slice(0, 3);
  console.log("gifts: " + allGifts[gifts.value[0]].name, allGifts[gifts.value[1]].name, allGifts[gifts.value[2]].name);
}

</script>

<template>
  <div class="justify-center">
    <div v-for="gift in allGifts" :key="gift.name">
      <button @click="selectGift(gift)" class="bg-white rounded-lg shadow-md overflow-hidden btn-pop px-4 py-2">
        <div class="px-4 py-2">
          <h2 class="text-lg font-medium text-gray-800">{{ gift.name }}</h2>
          <p class="text-sm text-gray-500">{{ gift.requireContribution }}</p>
          <p class="text-sm text-gray-500">{{ gift.description }}</p>
        </div>
      </button>
    </div>
  </div>
</template>
