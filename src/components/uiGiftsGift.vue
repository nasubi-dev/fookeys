<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from '@vueuse/core'
import { onLongPress } from '@vueuse/core'
import allGifts from "@/assets/allGifts";

defineProps<{
  gift: number;
}>();

const el = ref()
const dropDown = ref(false);
const htmlRefHook = ref<HTMLElement | null>(null)

const onLongPressCallbackHook = () => {
  dropDown.value = true
  console.log("longPress");
}
onLongPress(
  htmlRefHook,
  onLongPressCallbackHook,
  { modifiers: { prevent: true } }
)
onClickOutside(el, () => {
  dropDown.value = false
})

</script>

<template>
  <div class="flex flex-row w-auto h-auto">
    <div v-if="dropDown" ref="el" class="bg-white rounded">
      {{ dropDown }}
      <p>{{ "name: " +allGifts[gift]?.name }}</p>
      <p>{{ "description: " + allGifts[gift]?.description }}</p>
    </div>
    <div ref="htmlRefHook" class="mt-auto">
      <button class="p-5 mx-1 rounded-full bg-white" onselectstart="return false;" onmousedown="return false;">
      </button>
    </div>
  </div>
</template>