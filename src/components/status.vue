<script setup lang="ts">
import { useGameStore } from "@/store";

const gameStore = useGameStore();
</script>

<template>
  <div class="flex justify-end">
    <ul class="divide-x divide-gray-200">
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">name:{{ gameStore.players[0].name }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">HP❤:{{ gameStore.players[0].status.hp }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">hungry🍖:{{ gameStore.players[0].status.hungry }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">
          contribution🪙:{{ gameStore.players[0].status.contribution }}
        </p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">priority🦶:{{ gameStore.players[0].status.priority }}</p>
      </li>
    </ul>
  </div>
</template>
