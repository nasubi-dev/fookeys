<script setup lang="ts">
import { useGameStore } from "@/store";

const gameStore = useGameStore();

const props = defineProps<{
  id: 0 | 1;
}>();
</script>

<template>
  <div class="flex justify-end">
    <ul class="divide-x divide-gray-200">
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">name:{{ gameStore.players[props.id].name }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">character:{{ gameStore.players[props.id].character }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">gift:{{ gameStore.players[props.id].gift }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">HP❤:{{ gameStore.players[props.id].status.hp }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">
          hungry🍖:{{ gameStore.players[props.id].status.hungry }}
        </p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">
          contribution🪙:{{ gameStore.players[props.id].status.contribution }}
        </p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">
          priority🦶:{{ gameStore.players[props.id].status.priority }}
        </p>
      </li>
    </ul>
  </div>
</template>
