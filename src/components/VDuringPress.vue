<template>
  <div @pointerdown="startPress" @pointerup="endPress" @pointermove="endPress" @pointercancel="endPress" @click="endPress"
    @mouseenter="endPress" @contextmenu.prevent>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pressTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const p = defineProps<{
  onKeyDown: () => void
  onKeyUp: () => void
  delay: number
}>()

function startPress(): void {
  pressTimer.value = setTimeout(() => {
    p.onKeyDown()
  }, p.delay)
}
function endPress(): void {
  p.onKeyUp()
  if (!pressTimer.value) return
  clearTimeout(pressTimer.value)
  pressTimer.value = null
}
</script>