<script setup lang="ts">
import { toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";

const { id, player } = storeToRefs(playerStore);
const { idEnemy, idGame, name, character, gift } = toRefs(player.value);

</script>
<template>
  <div class="flex justify-start">
    <ul class="divide-y divide-gray-200">
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">id:{{ id }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">idEnemy:{{ idEnemy }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">idGame:{{ idGame }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">name:{{ name }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">character:{{ character?.name }}</p>
      </li>
      <li class="py-4">
        <p class="text-sm font-medium text-gray-900 truncate">gift1:{{ gift[0]?.name }}</p>
        <p class="text-sm font-medium text-gray-900 truncate">gift2:{{ gift[1]?.name }}</p>
        <p class="text-sm font-medium text-gray-900 truncate">gift3:{{ gift[2]?.name }}</p>
      </li>
    </ul>
  </div>
</template>
