<template>
  <div
    @pointerdown="startPress"
    @pointerup="endPress"
    @pointermove="endPress"
    @pointercancel="endPress"
    @click="endPress"
    @contextmenu.prevent
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const pressTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const p = defineProps<{
  onLongPress: () => void;
  delay: number;
}>();

function startPress(e: Event): void {
  pressTimer.value = setTimeout(() => {
    p.onLongPress();
  }, p.delay);
}
function endPress(): void {
  if (!pressTimer.value) return;
  clearTimeout(pressTimer.value);
  pressTimer.value = null;
}
</script>
