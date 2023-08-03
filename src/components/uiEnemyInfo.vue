<script setup lang="ts">
import { toRefs } from "vue";
import { enemyPlayerStore } from "@/main";
import { storeToRefs } from "pinia";
import type { PlayerData } from "@/types";
import UiGifts from "@/components/uiGifts.vue";
import allCharacters from "@/assets/allCharacters";
import enemyStatusImg from "@/assets/img/ui/enemyStatus.png";

const props = defineProps<{
  enemyPlayer: PlayerData
}>()
const { hand, name, character, status, gifts } = toRefs(props.enemyPlayer)

</script>

<template>
  <div>
    <ul class="text-xs flex justify-start">
      <div v-for="(card) in hand" :key="card.id">
        <img :src="`/img/companysBack/${card.company}.png`" class=" w-14 h-14" />
      </div>
    </ul>

    <div class="overCard h-auto" style="width:35dvw;">
      <img :src="enemyStatusImg" />
      <div class="overText">
        <span class="text-sm font-medium text-gray-900 truncate mx-2 transform -translate-y-3">
          name:{{ name }}
          {{ allCharacters[character].name }}
          ❤:{{ status.hp + "/" + (600 + (allCharacters[character].maxHp ?? 0)) }}
          🍖:{{ status.hungry + "/" + (200 + (allCharacters[character].maxHungry ?? 0)) }}
          🪙:{{ status.contribution }}
        </span>
      </div>

      <div class="overText mt-auto ">
        <UiGifts :gifts="gifts" player="enemyPlayer" class="transform -translate-x-3 translate-y-8" />
      </div>
    </div>

  </div>
</template>