<script setup lang="ts">
import type { PlayerData } from "@/types";
import UiGifts from "@/components/uiGifts.vue";
import uiCardBehind from "./uiCardBehind.vue";
import enemyStatusImg from "@/assets/img/ui/enemyStatus.png";
import blankissImg from "@/assets/img/characters/blankiss/plain.png";
import blankissImg2 from "@/assets/img/characters/blankiss/lose.png";

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
          <div class="ml-3 transform translate-y-8">
            <img v-if="sign !== 0" :src="blankissImg" class="w-36" />
            <img v-else :src="blankissImg2" class="w-36" />
          </div>
          <p class="font-bold text-xl text-gray-900">
            {{ "❤" + p.status.hp + "/" + p.status.maxHp }}
            {{ "🍖" + p.status.hungry + "/" + p.status.maxHungry }}
            {{ "🪙" + p.status.contribution }}
          </p>
        </div>

        <div>
          <UiGifts :gifts="p.gifts" :p="p" class="transform -translate-x-10 translate-y-8" />
        </div>
      </div>
    </div>
  </div>
</template>