<script setup lang="ts">
import { gameStore } from "@/main";
import { storeToRefs } from "pinia";

const { missions } = storeToRefs(gameStore);

</script>

<template>
  <div>
    <ul class="text-xs">
      <div v-for="mission in missions" :key="mission.id">
        <li>
          <span v-if="mission.achieved" class="text-sm font-medium text-gray-900 truncate mx-2">✔</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">id:{{ mission.id }}</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">name:{{ mission.name }}</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">reward:{{ mission.reward }}</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">description:{{ mission.description }}</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">achievement:{{
            mission.nowAchievement + "/" + mission.goalAchievement }}</span>
        </li>
      </div>
    </ul>
  </div>
</template>
