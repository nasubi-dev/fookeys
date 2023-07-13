<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";

//storeの参照
const { pushHand, popHand } = playerStore;
const { id, player, cardLock } = storeToRefs(playerStore);
const { name, hand } = toRefs(player.value);

</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Test</h1>
    <div>
      <p class="text-sm font-medium text-gray-900 truncate">id:{{ id }}</p>
      <p class="text-sm font-medium text-gray-900 truncate">name:{{ name }}</p>
    </div>

  </div>
</template>
