<script setup lang="ts">
import { ref, watch } from "vue";
import type { PlayerData } from "@/types";
import Character from "./character.vue";
import statusImg from "@/assets/img/ui/status.png";

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
  if (newVal.hungry < oldVal.hungry) hungryClass.value = "animate-shake"
  if (newVal.contribution < oldVal.contribution) contributionClass.value = "animate-shake"
}, { deep: true })
</script>

<template>
  <div class="overCard mt-auto" style="width:50dvw;" :class="wiggleClass">
    <img :src="statusImg" />
    <div class="overText w-full">
      <div class="flex justify-start w-full transform -translate-y-4">
        <Character status="my" @isWiggle="wiggleStatus" />
        <div class="flex justify-start font-bold text-gray-900 text-3xl mt-auto ml-auto mr-6 select-none">
          <div :class="hpClass">❤:{{ player.status.hp + "/" + player.status.maxHp }}</div>
          <div :class="hungryClass">🍖:{{ player.status.hungry + "/" + player.status.maxHungry }}</div>
          <div :class="contributionClass">🪙:{{ player.status.contribution }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
