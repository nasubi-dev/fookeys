<script setup lang="ts">
import { ref } from "vue";
import type { Mission } from "@/types";
import { onClickOutside } from '@vueuse/core'
import { onLongPress } from '@vueuse/core'
import infoImg from '@/assets/img/ui/info.png'

defineProps<{
  mission: Mission;
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
  <div>
    <div v-if="dropDown" ref="el" class="bg-white rounded">
      {{ mission.description }}
    </div>
    <div ref="htmlRefHook" class="overCard">
      <img :src="infoImg" onselectstart="return false;" onmousedown="return false;" style="width: 25vw;" />
      <div class="overText">
        <span v-if="mission.achieved" class="text-sm font-medium text-gray-900 truncate mx-2">✔</span>
        <span class="text-sm font-medium text-gray-900 truncate mx-2">{{ mission.name }}reward:
          {{ mission.reward }}
        </span>
        <span class="text-sm font-medium text-gray-900 truncate mx-2">achievement:{{
          mission.nowAchievement + "/" + mission.goalAchievement }}</span>
      </div>
    </div>
  </div>
</template>
