<script setup lang="ts">
import type { PlayerData } from "@/types";
import UiGifts from "@/components/uiGifts.vue";
import uiCardBehind from "./uiCardBehind.vue";
import allCharacters from "@/assets/allCharacters";
import enemyStatusImg from "@/assets/img/ui/enemyStatus.png";

defineProps<{
  p: PlayerData
}>()

</script>

<template>
  <div class="flex flex-col ml-auto">
    <uiCardBehind :cards="p.hand" />

    <div class="overCard h-auto" style="width:35dvw;">
      <img :src="enemyStatusImg" />
      <div class="overText">
        <span class="text-sm font-medium text-gray-900 truncate mx-2 transform -translate-y-3">
          name:{{ p.name }}
          {{ allCharacters[p.character].name }}
          ❤:{{ p.status.hp + "/" + (600 + (allCharacters[p.character].maxHp ?? 0)) }}
          🍖:{{ p.status.hungry + "/" + (200 + (allCharacters[p.character].maxHungry ?? 0)) }}
          🪙:{{ p.status.contribution }}
        </span>

        <div class="">
          <UiGifts :gifts="p.gifts" player="enemyPlayer" class="transform -translate-x-3 translate-y-8" />
        </div>
      </div>
    </div>
  </div>
</template>