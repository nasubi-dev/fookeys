<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { e, s, i } from "@/log";
import type { Mission } from "@/types";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { setHand } from "@/server/useShopUtils";
import UiHand from "@/components/uiHand.vue";

//storeの参照
const { id, player } = storeToRefs(playerStore);
const { name, hand, status } = toRefs(player.value);

const a = ref<boolean[]>([]);

</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <button @click="a.push(true)">push</button>
    <transition-group appear enter-from-class="translate-y-[-150%] opacity-0" leave-to-class="translate-y-[150%] opacity-0"
      leave-active-class="transition duration-300" enter-active-class="transition duration-300">
        <div v-for="(b, index) in a" :key="index">
          {{ b }}
        </div>
    </transition-group>
  </div>
</template>
