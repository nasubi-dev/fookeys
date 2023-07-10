<script setup lang="ts">
import { toRefs } from "vue";
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { watchShopEnd } from "@/server/useShop";
import allGifts from "@/assets/allGifts";

const { player, phase } = storeToRefs(playerStore);
const { gifts, status, check, isSelectedGift } = toRefs(player.value);

const useGift = async () => {
  await watchShopEnd();
}
</script>

<template>
  <div>
    <div v-if="phase === 'shop'">
      <button @click="useGift()" :class="check ? 'bg-red-500' : 'bg-blue-500'">選択確定</button>
      {{ isSelectedGift }}
      <div v-for="(gift, index) in gifts" :key="gift">
        <button :class="status.contribution >= allGifts[gift].requireContribution ? 'bg-blue-500' : 'bg-red-500'"
          class=" text-white font-bold py-2 px-4 rounded"
          @click="status.contribution >= allGifts[gift].requireContribution ? isSelectedGift = index : null">
          {{ allGifts[gift].name }}
          {{ allGifts[gift].requireContribution }}
          {{ allGifts[gift].description }}
        </button>
        <button v-if="index === isSelectedGift" @click="isSelectedGift = undefined"
          class="bg-blue-500 text-white font-bold py-2 px-4 rounded">選択解除</button>
      </div>
    </div>
  </div>
</template>