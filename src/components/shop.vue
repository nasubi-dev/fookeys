<script setup lang="ts">
import { ref,watch } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import ShopDrawCards from './shopDrawCards.vue';
import ShopUseGifts from './shopUseGifts.vue';

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
    <div v-else>
      <button @click="draw = !draw" class="bg-white m-2">Draw Cards</button>
      <button @click="use = !use" class="bg-white m-2">Use Gifts</button>
    </div>
  </div>
</template>