<script setup lang="ts">
import { toRefs } from "vue";
import { gameStore } from "@/main";
import { storeToRefs } from "pinia";
import allMissions from "@/assets/allMissions";

const { game } = storeToRefs(gameStore);
const { missions } = toRefs(game.value);

</script>

<template>
  <div>
    <ul class="text-xs">
      <div v-for="mission in missions" :key="mission">
        <li>
          mission:{{ mission }}
          <span class="text-sm font-medium text-gray-900 truncate mx-2">id:{{ allMissions[mission]?.id }}</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">name:{{ allMissions[mission]?.name }}</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">reward:{{ allMissions[mission]?.reward }}</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">description:{{ allMissions[mission]?.description }}</span>
        </li>
      </div>
    </ul>
  </div>
</template>
