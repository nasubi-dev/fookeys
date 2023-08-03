<script setup lang="ts">
import { toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import allCharacters from "@/assets/allCharacters";
import statusImg from "@/assets/img/ui/status.png";

const { player } = storeToRefs(playerStore);
const { name, character, status } = toRefs(player.value);

</script>

<template>
  <div class="overCard  mt-auto" style="width:50dvw;">
    <img :src="statusImg" class="" />
    <div class="overText transform translate-y-3">
      <span class="text-sm font-medium text-gray-900 truncate mx-2">
        name:{{ name }}
        {{ allCharacters[player.character].name }}
        ❤:{{ status.hp + "/" + (600 + (allCharacters[character].maxHp ?? 0)) }}
        🍖:{{ status.hungry + "/" + (200 + (allCharacters[character].maxHungry ?? 0)) }}
        🪙:{{ status.contribution }}
      </span>
    </div>
  </div>
</template>
