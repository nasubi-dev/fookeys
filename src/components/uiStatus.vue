<script setup lang="ts">
import { ref } from "vue";
import Character from "./character.vue";
import statusImg from "@/assets/img/ui/status.png";
import type { PlayerData } from "@/types";

defineProps<{ player: PlayerData }>()

const shakeClass = ref()
const wiggleClass = ref()
const shakeStatus = (reactionImg: string) => {
  shakeClass.value = reactionImg === "damage" ? "animate-shake" : null
  wiggleClass.value = reactionImg === "damage" ? "animate-wiggle animate-once" : null
}
</script>

<template>
  <div class="overCard mt-auto" style="width:50dvw;" :class="shakeClass">
    <div :class="wiggleClass">
      <img :src="statusImg" />
      <div class="overText w-full">
        <div class="flex justify-start w-full transform -translate-y-4">
          <Character status="my" @isShake="shakeStatus" />
          <p class="font-bold text-3xl mt-auto ml-auto mr-6">
            ❤:{{ player.status.hp + "/" + player.status.maxHp }}
            🍖:{{ player.status.hungry + "/" + player.status.maxHungry }}
            🪙:{{ player.status.contribution }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
