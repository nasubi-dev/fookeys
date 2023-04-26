<script setup lang="ts">
import type { Mission } from "@/types";

defineProps<{
	missions: Mission[];
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
