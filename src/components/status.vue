<script setup lang="ts">
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
const { name, character, gift, status } = storeToRefs(playerStore);
</script>

<template>
  <div class="flex justify-start">
    <span class="text-sm font-medium text-gray-900 truncate">name:{{ name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate">character:{{ character?.name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate">gift1:{{ gift[0]?.name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate">gift2:{{ gift[1]?.name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate">gift3:{{ gift[2]?.name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate">HP❤:{{ status.hp }} </span>
    <span class="text-sm font-medium text-gray-900 truncate">hungry🍖:{{ status.hungry }} </span>
    <span class="text-sm font-medium text-gray-900 truncate">contribution🪙:{{ status.contribution }} </span>
    <span class="text-sm font-medium text-gray-900 truncate">priority🦶:{{ status.priority }} </span>
  </div>
</template>
