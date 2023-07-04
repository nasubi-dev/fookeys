<script setup lang="ts">
import { toRefs } from "vue";
import type { Character, Gift } from "@/types";
import { storeToRefs } from "pinia";
import { playerStore } from "@/main";
import allCharacters from "@/assets/allCharacters";
import allGifts from "@/assets/allGifts";

const { player } = storeToRefs(playerStore);
const { character, gifts } = toRefs(player.value);

defineProps<{
  selectType: string;
}>();

function selectCharacter(card: Character) {
  character.value = card.id;
  console.log("character: " + allCharacters[character.value].name);
}
function selectGift(card: Gift) {
  gifts.value.unshift(card.id);
  gifts.value = gifts.value.slice(0, 3);
  console.log("gifts: " + allGifts[gifts.value[0]].name, allGifts[gifts.value[1]].name, allGifts[gifts.value[2]].name);
}

</script>

<template>
  <div class="justify-center">
    <div v-if="selectType == 'character'">
      <div v-for="card in allCharacters" :key="card.name">
        <button @click="selectCharacter(card)" class="bg-white rounded-lg shadow-md overflow-hidden btn-pop px-4 py-2">
          <div class="px-4 py-2">
            <h2 class="text-lg font-medium text-gray-800">{{ card.name }}</h2>
            <p class="text-sm text-gray-500">{{ card.company }}</p>
            <p class="text-sm text-gray-500">{{ card.description }}</p>
          </div>
        </button>
      </div>
    </div>

    <div v-else>
      <div v-for="card in allGifts" :key="card.name">
        <button @click="selectGift(card)" class="bg-white rounded-lg shadow-md overflow-hidden btn-pop px-4 py-2">
          <div class="px-4 py-2">
            <h2 class="text-lg font-medium text-gray-800">{{ card.name }}</h2>
            <p class="text-sm text-gray-500">{{ card.requireContribution }}</p>
            <p class="text-sm text-gray-500">{{ card.description }}</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
