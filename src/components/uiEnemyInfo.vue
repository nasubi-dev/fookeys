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
        <div class="flex justify-start w-full transform translate-y-10 pl-8">
          <p class="text-xl font-medium text-gray-900">
            ❤:{{ p.status.hp + "/" + p.status.maxHp }}
            🍖:{{ p.status.hungry + "/" + p.status.maxHungry }}
            🪙:{{ p.status.contribution }}
          </p>
          <img v-if="sign !== 0" :src="blankissImg" class="w-36 inline-block ml-4" />
          <img v-else :src="blankissImg2" class="w-36 inline-block ml-4" />
        </div>

        <div>
          <UiGifts :gifts="p.gifts" player="enemyPlayer" class="transform -translate-x-10 -translate-y-2" />
        </div>
      </div>
    </div>
  </div>
</template>