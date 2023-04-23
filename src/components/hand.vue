<script setup lang="ts">
import type { Hand } from "@/types";

const props = defineProps<{
  hand: Hand;
}>();
</script>

<template>
  <div>
    <ul class="divide-x divide-gray-200">
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">{{ props.hand[0] }}</p>
      </li>
    </ul>
  </div>
</template>
