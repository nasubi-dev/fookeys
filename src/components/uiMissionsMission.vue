<script setup lang="ts">
import type { Mission } from "@/types";

defineProps<{
  mission: Mission;
}>();

</script>

<template>
  <div>
    <span v-if="mission.achieved" class="text-sm font-medium text-gray-900 truncate mx-2">✔</span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">{{ mission.name }}</span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">reward:{{ mission.reward }}</span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">{{ mission.description }}</span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">achievement:{{
      mission.nowAchievement + "/" + mission.goalAchievement }}</span>
  </div>
</template>
