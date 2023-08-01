<script setup lang="ts">
import { toRefs } from "vue";
import { enemyPlayerStore } from "@/main";
import { storeToRefs } from "pinia";
import allCharacters from "@/assets/allCharacters";
import enemyStatusImg from "@/assets/img/ui/enemyStatus.png";

const { enemyPlayer } = storeToRefs(enemyPlayerStore);
const { hand, name, character, status } = toRefs(enemyPlayer.value);

</script>

<template>
  <div>
    <ul class="text-xs flex justify-start">
      <div v-for="(card) in hand" :key="card.id">
        <img :src="`/img/companysBack/${card.company}.png`" class=" w-14 h-14" />
      </div>
    </ul>
    <div class="overCard w-1/3 h-auto">
      <img :src="enemyStatusImg" class="" />
      <div class="overText transform translate-y-3">
        <span class="text-sm font-medium text-gray-900 truncate mx-2">
          name:{{ name }}
          {{ allCharacters[character].name }}
          ❤:{{ status.hp + "/" + (600 + (allCharacters[character].maxHp ?? 0)) }}
          🍖:{{ status.hungry + "/" + (200 + (allCharacters[character].maxHungry ?? 0)) }}
          🪙:{{ status.contribution }}
        </span>
      </div>
    </div>

  </div>
</template>