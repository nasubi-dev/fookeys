<script setup lang="ts">
import { toRefs } from "vue";
import { gameStore } from "@/main";
import { storeToRefs } from "pinia";
import UiMission from "@/components/uiMissionsMission.vue";

const { missions } = storeToRefs(gameStore);

</script>

<template>
  <div>
    <div v-for="mission in missions" :key="mission.id">
      <UiMission :mission="mission" />
    </div>
  </div>
</template>
