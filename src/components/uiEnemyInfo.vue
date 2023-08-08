<script setup lang="ts">
import type { PlayerData } from "@/types";
import UiGifts from "@/components/uiGifts.vue";
import allCharacters from "@/assets/allCharacters";
import enemyStatusImg from "@/assets/img/ui/enemyStatus.png";

defineProps<{
  e: PlayerData
}>()

</script>

<template>
  <div class="flex flex-col ml-auto">
    <ul class="text-xs flex justify-start">
      <div v-for="(card) in e.hand" :key="card.id">
        <img :src="`/img/companysBack/${card.company}.png`" class=" w-14 h-14" />
      </div>
    </ul>

    <div class="overCard h-auto" style="width:35dvw;">
      <img :src="enemyStatusImg" />
      <div class="overText">
        <span class="text-sm font-medium text-gray-900 truncate mx-2 transform -translate-y-3">
          name:{{ e.name }}
          {{ allCharacters[e.character].name }}
          ❤:{{ e.status.hp + "/" + (600 + (allCharacters[e.character].maxHp ?? 0)) }}
          🍖:{{ e.status.hungry + "/" + (200 + (allCharacters[e.character].maxHungry ?? 0)) }}
          🪙:{{ e.status.contribution }}
        </span>

        <div class="">
          <UiGifts :gifts="e.gifts" player="enemyPlayer" class="transform -translate-x-3 translate-y-8" />
        </div>
      </div>
    </div>
  </div>
</template>