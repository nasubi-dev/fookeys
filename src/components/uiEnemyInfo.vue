<script setup lang="ts">
import { ref, watch } from "vue";
import type { PlayerData } from "@/types";
import Character from "./character.vue";
import UiGifts from "@/components/uiGifts.vue";
import uiCardBehind from "./uiCardBehind.vue";
import enemyStatusImg from "@/assets/img/ui/enemyStatus.png";

const p = defineProps<{ player: PlayerData }>()

const wiggleClass = ref()
const wiggleStatus = (reactionImg: string) => {
  wiggleClass.value = reactionImg === "damage" ? "animate-wiggle animate-once" : null
}

const hpClass = ref()
const hungryClass = ref()
const contributionClass = ref()
watch(() => p.player.status, (newVal, oldVal) => {
  //初期化
  hpClass.value = hungryClass.value = contributionClass.value = null
  //増えたらshake
  if (newVal.hp > oldVal.hp) hpClass.value = "animate-jump"
  if (newVal.hungry > oldVal.hungry) hungryClass.value = "animate-jump"
  if (newVal.contribution > oldVal.contribution) contributionClass.value = "animate-jump"
  //減ったらjump
  // if (newVal.hp < oldVal.hp) hpClass.value = "animate-shake"
  if (newVal.hungry < oldVal.hungry) hungryClass.value = "animate-shake"
  if (newVal.contribution < oldVal.contribution) contributionClass.value = "animate-shake"

}, { deep: true })
</script>

<template>
  <div class="flex flex-col ml-auto">
    <div>
      <div v-if="player.hand.length > 0" class="flex justify-end">
        <uiCardBehind :cards="player.hand" />
      </div>
      <div v-else>
        <div class="w-14 h-14"></div>
      </div>
    </div>

    <div class="overCard ml-auto" style="width:35dvw;" :class="wiggleClass">
      <img :src="enemyStatusImg" />
      <div class="overText w-full">
        <div class="flex flex-row-reverse justify-center items-center w-full">
          <Character status="enemy" class="ml-auto" @isWiggle="wiggleStatus" />
          <div class="flex justify-start font-bold text-xl text-gray-900 ml-3">
            <div :class="hpClass">❤:{{ player.status.hp + "/" + player.status.maxHp }}</div>
            <div :class="hungryClass">🍖:{{ player.status.hungry + "/" + player.status.maxHungry }}</div>
            <div :class="contributionClass">🪙:{{ player.status.contribution }}</div>
          </div>
        </div>
        <div class="transform -translate-x-10 -translate-y-4 w-1/2">
          <UiGifts :gifts="player.gifts" :player="player" />
        </div>
      </div>
    </div>
  </div>
</template>