<script setup lang="ts">
import type { PlayerData } from "@/types";
import UiGifts from "@/components/uiGifts.vue";
import uiCardBehind from "./uiCardBehind.vue";
import allCharacters from "@/assets/allCharacters";
import enemyStatusImg from "@/assets/img/ui/enemyStatus.png";
import nasubiImg from "@/assets/img/nasubi.png";

defineProps<{
  p: PlayerData
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
            ❤:{{ p.status.hp + "/" + (600 + (allCharacters[p.character].maxHp ?? 0)) }}
            🍖:{{ p.status.hungry + "/" + (200 + (allCharacters[p.character].maxHungry ?? 0)) }}
            🪙:{{ p.status.contribution }}
          </p>
          <img :src="nasubiImg" class="w-24 inline-block ml-auto mb-5 mr-4" />
        </div>

        <div>
          <UiGifts :gifts="p.gifts" player="enemyPlayer" class="transform -translate-x-3 -translate-y-4" />
        </div>
      </div>
    </div>
  </div>
</template>