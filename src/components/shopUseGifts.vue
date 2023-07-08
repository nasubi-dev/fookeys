<script setup lang="ts">
import { toRefs, ref } from "vue";
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import allGifts from "@/assets/allGifts";

const { player, phase } = storeToRefs(playerStore);
const { gifts, status } = toRefs(player.value);

const isGiftSelected = ref([false, false, false]);

const useGift = (index: boolean[]) => {
  const selectedGifts = gifts.value.filter((gift, index) => isGiftSelected.value[index]);
  console.log(i, "selectedGifts: ", selectedGifts.map((gift) => allGifts[gift].name));
  //giftで使った分の貢献度を減らす
  
}
</script>

<template>
  <div>
    <div v-if="phase === 'shop'">
      <button @click="useGift(isGiftSelected), phase = 'battle'" class="bg-white">選択確定</button>
      {{ isGiftSelected }}
      <div v-for="(gift, index) in gifts" :key="gift">
        <button :class="status.contribution >= allGifts[gift].requireContribution ? 'bg-blue-500' : 'bg-red-500'"
          class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          @click="status.contribution >= allGifts[gift].requireContribution ? isGiftSelected[index] = !isGiftSelected[index] : null">
          {{ allGifts[gift].name }}
          {{ allGifts[gift].description }}
          {{ allGifts[gift].requireContribution }}
        </button>
      </div>
    </div>
  </div>
</template>