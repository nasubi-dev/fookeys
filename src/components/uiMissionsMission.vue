<script setup lang="ts">
import { ref } from "vue";
import type { Mission } from "@/types";
import { onClickOutside } from '@vueuse/core'
import { onLongPress } from '@vueuse/core'
import missionImg from '@/assets/img/ui/mission.png'

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
    <div v-if="dropDown" ref="el" class="bg-white rounded fixed z-10 overflow-clip">
      {{ mission.description }}
    </div>
    <div ref="htmlRefHook" class="overCard w-full">
      <img :src="missionImg" onselectstart="return false;" onmousedown="return false;" style="width: 25vw;" />
      <div class="overText">
        <span class="text-sm font-medium text-gray-900 mx-2 mt-5 w-max">
          {{ mission.name }}
          <span class="ml-auto">{{ "🪙" + mission.reward }}</span>
        </span>
        <div class="gauge">
          <span v-if="mission.achieved" class="text-sm font-medium text-gray-900 truncate mx-2">✔</span>
          <span v-else class=" text-white text-sm font-medium truncate mx-2 fixed">{{ mission.nowAchievement + "/" +
            mission.goalAchievement }}</span>
          <div class="bar" :style="{ width: (100 - ((mission.nowAchievement / mission.goalAchievement) * 100)) + '%' }">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
