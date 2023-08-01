<script setup lang="ts">
import { gameStore } from "@/main";
import { storeToRefs } from "pinia";
import infoImg from "@/assets/img/ui/info.png";

const { missions } = storeToRefs(gameStore);

</script>

<template>
  <div>
    <div v-for="mission in missions" :key="mission.id">
      <div class="overCard">
        <img :src="infoImg" />
        <div class="overText">
          <span v-if="mission.achieved" class="text-sm font-medium text-gray-900 truncate mx-2">✔</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">name:{{ mission.name }}</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">reward:{{ mission.reward }}</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">description:{{ mission.description }}</span>
          <span class="text-sm font-medium text-gray-900 truncate mx-2">achievement:{{
            mission.nowAchievement + "/" + mission.goalAchievement }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
