<script setup lang="ts">
import { ref, toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
//storeの参照
const { id, player } = storeToRefs(playerStore);
const { name } = toRefs(player.value);

const img = ref("norma")

</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Test</h1>
    <div>
      <p class="text-sm font-medium text-gray-900 truncate">id:{{ id }}</p>
      <p class="text-sm font-medium text-gray-900 truncate">name:{{ name }}</p>
    </div>
    <div>
      <span>Assets</span>
      <img src="@/assets/card1.png" alt="card1" />
    </div>
  </div>
</template>
