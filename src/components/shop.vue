<script setup lang="ts">
import { ref } from "vue";
import ShopDrawCards from './shopDrawCards.vue';
import ShopUseGifts from './shopUseGifts.vue';

const use = ref(false);
const draw = ref(false);
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