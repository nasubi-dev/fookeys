<script setup lang="ts">
import { playerStore } from "@/main";
</script>

<template>
  <div class="flex justify-end">
    <ul class="divide-x divide-gray-200">
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">name:{{ playerStore.name }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">character:{{ playerStore.character }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">gift:{{ playerStore.gift }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">HP❤:{{ playerStore.status.hp }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">hungry🍖:{{ playerStore.status.hungry }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">contribution🪙:{{ playerStore.status.contribution }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">priority🦶:{{ playerStore.status.priority }}</p>
      </li>
    </ul>
  </div>
</template>
