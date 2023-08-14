<script setup lang="ts">
import { ref, watch } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import ShopDrawCards from './shopDrawCards.vue';
import ShopUseGifts from './shopUseGifts.vue';
import drawCard from "@/assets/img/ui/drawCard.png";
import useGift from "@/assets/img/ui/useGift.png";

const { cardLock } = storeToRefs(playerStore);

const use = ref(false);
const draw = ref(false);
//WatchでCardLockを監視して､trueになったらuseとdrawをfalseにする
watch(cardLock, (newVal) => {
  if (newVal) {
    use.value = false;
    draw.value = false;
  }
})
//!shopフェーズを無視することができるが､将来的にポップアップになるのでOk
</script>

<template>
  <div>
    <div v-if="draw">
      <ShopDrawCards />
    </div>
    <div v-else-if="use">
      <ShopUseGifts />
    </div>
    <div v-else class="flex justify-start">
      <div class="overCard" style="width: 20vw;">
        <button @click="draw = !draw">
          <img :src="drawCard" />
        </button>
      </div>
      <div class="overCard">
        <button @click="use = !use" style="width: 20vw;">
          <img :src="useGift" />
        </button>
      </div>
    </div>
  </div>
</template>