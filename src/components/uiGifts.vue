<script setup lang="ts">
import UiGift from "@/components/uiGiftsGift.vue";

defineProps<{
  gifts: number[];
  player: "player" | "enemyPlayer";
}>();

</script>

<template>
  <div class="flex flex-row w-auto h-auto">
    <div v-for="gift in gifts" :key="gift" class="mt-auto">
      <UiGift :gift="gift"  />
    </div>
  </div>
</template>