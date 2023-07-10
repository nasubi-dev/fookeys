<script setup lang="ts">
import { toRefs, ref } from "vue";
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { watchShopEnd } from "@/server/useShop";
import allGifts from "@/assets/allGifts";

const { player, phase } = storeToRefs(playerStore);
const { gifts, status, check } = toRefs(player.value);

const isGiftSelected = ref();

const useGift = async () => {
  await watchShopEnd();
  if (isGiftSelected.value) {
    console.log(i, "selectedGifts: ", allGifts[isGiftSelected.value].name);
    //giftで使った分の貢献度を減らす
    status.value.contribution -= allGifts[isGiftSelected.value].requireContribution;
  }
}
</script>

<template>
  <div>
    <div v-if="phase === 'shop'">
      <button @click="useGift()" :class="check ? 'bg-blue-500' : 'bg-red-500'" class="bg-white">選択確定</button>
      {{ isGiftSelected }}
      <div v-for="(gift, index) in gifts" :key="gift">
        <div v-if="index === isGiftSelected">
          <button @click="isGiftSelected = null" class="bg-white">選択解除</button>
        </div>
        <button :class="status.contribution >= allGifts[gift].requireContribution ? 'bg-blue-500' : 'bg-red-500'"
          class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          @click="status.contribution >= allGifts[gift].requireContribution ? isGiftSelected = index : null">
          {{ allGifts[gift].name }}
          {{ allGifts[gift].requireContribution }}
          {{ allGifts[gift].description }}
        </button>
      </div>
    </div>
  </div>
</template>