<script setup lang="ts">
import { toRefs } from "vue";
import type { Gift } from "@/types";
import { storeToRefs } from "pinia";
import { playerStore } from "@/main";
import allGifts from "@/assets/allGifts";

const { player } = storeToRefs(playerStore);
const { gifts } = toRefs(player.value);

function selectGift(gift: number): void {
  //GiftがGiftsに含まれている数値だった場合､Return
  if (gifts.value.includes(gift)) return;
  if (gifts.value.length > 3) return;
  gifts.value.unshift(gift);
  gifts.value = gifts.value.slice(0, 3);
  console.log("gifts: " + allGifts[gifts.value[0]].name, allGifts[gifts.value[1]].name, allGifts[gifts.value[2]].name);
}

</script>

<template>
  <div class="flex flex-wrap my-3">
    <div v-for="gift in allGifts" :key="gift.name">
      <div class="">
        <button @click="selectGift(gift.id)" class="bg-white rounded-lg btn-pop p-1">
          <div class="flex">
            <img :src="`./img/gifts/${gift.id}.png`" class="w-10 h-10" />
            <div>
              <h2 class="text-lg font-medium text-gray-800 text-left">{{ gift.name + " 🪙" + gift.requireContribution }}
              </h2>
              <p class=" text-gray-500">{{ gift.description }}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
