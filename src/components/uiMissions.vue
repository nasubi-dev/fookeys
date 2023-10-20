<script setup lang="ts">
import { toRefs } from "vue";
import { gameStore } from "@/main";
import { storeToRefs } from "pinia";
import UiMission from "@/components/uiMissionsMission.vue";

const { missions } = storeToRefs(gameStore);

</script>

<template>
  <div class="overflow-clip">
    <transition-group enter-from-class="translate-x-[150%] opacity-0" leave-to-class="translate-x-[-150%] opacity-0"
      leave-active-class="transition duration-300" enter-active-class="transition duration-300">
      <div v-for="mission in missions" :key="mission.id">
        <UiMission :mission="mission" />
      </div>
    </transition-group>
  </div>
</template>
