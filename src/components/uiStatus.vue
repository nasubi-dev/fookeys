<script setup lang="ts">
import type { PlayerData } from "@/types";
import allCharacters from "@/assets/allCharacters";
import allGifts from "@/assets/allGifts";

defineProps<{ player: PlayerData }>();

</script>

<template>
  <div class="flex justify-start">
    <span class="text-sm font-medium text-gray-900 truncate mx-2">name:{{ player.name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">character:{{ allCharacters[player.character].name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">gift1:{{ allGifts[player.gifts[0]].name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">gift2:{{ allGifts[player.gifts[1]].name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">gift3:{{ allGifts[player.gifts[2]].name }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">❤:{{ player.status.hp + "/" + (600 + (allCharacters[player.character].maxHp ?? 0)) }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">🍖:{{ player.status.hungry +"/"+(200 + (allCharacters[player.character].maxHungry ?? 0)) }} </span>
    <span class="text-sm font-medium text-gray-900 truncate mx-2">🪙:{{ player.status.contribution }} </span>
  </div>
</template>
