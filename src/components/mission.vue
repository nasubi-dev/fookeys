<script setup lang="ts">
import type { Missions } from "@/types";

defineProps<{
	missions: Missions;
}>();
</script>

<template>
  <div>
    <ul class="text-xs">
      <div v-for="mission in missions" :key="mission.name">
        <li>
          name:{{ mission.name }} description:{{ mission.description }} 
          <div>------</div>
        </li>
      </div>
    </ul>
  </div>
</template>
