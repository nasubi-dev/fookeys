<script setup lang="ts">
import { ref, toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";

//storeの参照
const { id, player } = storeToRefs(playerStore);
const { name, hand } = toRefs(player.value);



</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Test</h1>
    <div>
      <p class="text-sm font-medium text-gray-900 truncate">id:{{ id }}</p>
      <p class="text-sm font-medium text-gray-900 truncate">name:{{ name }}</p>
    </div>

    <button @click.left.prevent="console.log('left')" @click.right.prevent="console.log('right')">Click Me!!!</button>
  </div>
</template>
