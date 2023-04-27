<script setup lang="ts">
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
const { name, character, gift, status } = storeToRefs(playerStore);
</script>

<template>
  <div class="flex justify-end">
    <ul class="divide-x divide-gray-200">
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">name:{{ name }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">character:{{ character?.name }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">gift1:{{ gift[0] }}</p>
        <p class="text-sm font-medium text-gray-900 truncate">gift2:{{ gift[1] }}</p>
        <p class="text-sm font-medium text-gray-900 truncate">gift3:{{ gift[2] }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">HP❤:{{ status.hp }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">hungry🍖:{{ status.hungry }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">contribution🪙:{{ status.contribution }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">priority🦶:{{ status.priority }}</p>
      </li>
    </ul>
  </div>
</template>
