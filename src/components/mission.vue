<script setup lang="ts">
import { toRefs } from "vue";
import {  gameStore } from "@/main";
import { storeToRefs } from "pinia";

const { game } = storeToRefs(gameStore);
const { missions } = toRefs(game.value);

</script>

<template>
  <div>
    <ul class="text-xs">
      <div v-for="mission in missions" :key="mission.name">
        <li>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">name:{{ mission.name }}</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">description:{{ mission.description }}</span>
        </li>
      </div>
    </ul>
  </div>
</template>
