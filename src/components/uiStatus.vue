<script setup lang="ts">
import { toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import allCharacters from "@/assets/allCharacters";
import allGifts from "@/assets/allGifts";

const {  player } = storeToRefs(playerStore);
const { name, character, gifts, status } = toRefs(player.value);

</script>

<template>
  <div class="flex justify-start">
    <span class="text-sm font-medium text-gray-900 truncate mx-2">name:{{ name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">character:{{ allCharacters[character].name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">gift1:{{ allGifts[gifts[0]].name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">gift2:{{ allGifts[gifts[1]].name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">gift3:{{ allGifts[gifts[2]].name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">❤:{{ status.hp + "/" + (600 + (allCharacters[character].maxHp ?? 0)) }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">🍖:{{ status.hungry +"/"+(200 + (allCharacters[character].maxHungry ?? 0)) }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">🪙:{{ status.contribution }} </span>
  </div>
</template>
