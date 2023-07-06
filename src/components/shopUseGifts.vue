<script setup lang="ts">
import { toRefs, ref } from "vue";
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import allGifts from "@/assets/allGifts";

const { player } = storeToRefs(playerStore);
const { gifts, status } = toRefs(player.value);

const useGift = (index: number) => {
  console.log(i, "useGift: ", index);
}
</script>

<template>
  <div>
    <div v-for="(gift, index) in gifts" :key="gift">
      <button :class="status.contribution >= allGifts[gift].requireContribution ? 'bg-blue-500' : 'bg-red-500'"
        class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        @click="status.contribution >= allGifts[gift].requireContribution ? useGift(index) : null">
        {{ allGifts[gift].name }}
        {{ allGifts[gift].description }}
        {{ allGifts[gift].requireContribution }}
      </button>
    </div>
  </div>
</template>