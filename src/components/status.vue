<script setup lang="ts">
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";

const {  player } = storeToRefs(playerStore);
const { name, character, gift, status } = player.value;

</script>

<template>
  <div class="flex justify-start">
    <span class="text-sm font-medium text-gray-900 truncate mx-2">name:{{ name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">character:{{ character?.name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">gift1:{{ gift[0]?.name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">gift2:{{ gift[1]?.name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">gift3:{{ gift[2]?.name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">❤:{{ status.hp }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">🍖:{{ status.hungry }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">🪙:{{ status.contribution }} </span>
  </div>
</template>
