<script setup lang="ts">
import { ref } from "vue";
import type { PlayerData } from "@/types";
import Character from "./character.vue";
import UiGifts from "@/components/uiGifts.vue";
import uiCardBehind from "./uiCardBehind.vue";
import enemyStatusImg from "@/assets/img/ui/enemyStatus.png";

defineProps<{
  p: PlayerData
  sign: number
}>()
const shakeClass = ref()
const wiggleClass = ref()
const shakeStatus = (reactionImg: string) => {
  wiggleClass.value = reactionImg === "damage" ? "animate-wiggle animate-once" : null
}
</script>

<template>
  <div class="flex flex-col ml-auto">
    <div v-if="p.hand.length > 0" class="flex justify-end">
      <uiCardBehind :cards="p.hand" />
    </div>
    <div v-else>
      <div class="w-14 h-14"></div>
    </div>

    <div class="overCard" style="width:35dvw;" :class="shakeClass">
      <div :class="wiggleClass">
        <img :src="enemyStatusImg" />
        <div class="overText w-full">
          <div class="flex flex-row-reverse justify-center items-center w-full">
            <Character status="enemy" class="ml-auto" @isShake="shakeStatus" />
            <p class="font-bold text-xl text-gray-900">
              {{ "❤" + p.status.hp + "/" + p.status.maxHp }}
              {{ "🍖" + p.status.hungry + "/" + p.status.maxHungry }}
              {{ "🪙" + p.status.contribution }}
            </p>
          </div>
          <div class="transform -translate-x-10 -translate-y-4 w-1/2">
            <UiGifts :gifts="p.gifts" :player="p" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>