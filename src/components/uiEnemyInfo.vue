<script setup lang="ts">
import type { PlayerData } from "@/types";
import Character from "./character.vue";
import UiGifts from "@/components/uiGifts.vue";
import uiCardBehind from "./uiCardBehind.vue";
import enemyStatusImg from "@/assets/img/ui/enemyStatus.png";

defineProps<{
  p: PlayerData
  sign: number
}>()

</script>

<template>
  <div class="flex flex-col ml-auto">
    <div v-if="p.hand.length > 0" class="flex justify-end">
      <uiCardBehind :cards="p.hand" />
    </div>
    <div v-else>
      <div class="w-14 h-14"></div>
    </div>

    <div class="overCard h-auto ml-auto" style="width:35dvw;">
      <img :src="enemyStatusImg" />
      <div class="overText w-full">
        <div class="flex flex-row-reverse justify-center items-center w-full px-4">
          <Character status="enemy" class="ml-auto" />
          <p class="font-bold text-xl text-gray-900">
            {{ "❤" + p.status.hp + "/" + p.status.maxHp }}
            {{ "🍖" + p.status.hungry + "/" + p.status.maxHungry }}
            {{ "🪙" + p.status.contribution }}
          </p>
        </div>

        <div>
          <UiGifts :gifts="p.gifts" :player="p" class="transform -translate-x-10 -translate-y-4" />
        </div>
      </div>
    </div>
  </div>
</template>