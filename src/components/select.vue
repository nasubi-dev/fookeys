<script setup lang="ts">
import { toRefs } from "vue";
import type { Character, Gift } from "@/types";
import { storeToRefs } from "pinia";
import { playerStore } from "@/main";

const { player } = storeToRefs(playerStore);
const { character, gift } = toRefs(player.value);

const props = defineProps<{
  cards: (Character | Gift)[];
  selectType: string;
}>();

function selectCard(card: Character | Gift, selectType: string) {
  if (selectType == "character") {
    character.value = card as Character;
    console.log("character: " + character.value?.name);
  }
  if (selectType == "gift") {
    gift.value.unshift(card as Gift);
    gift.value = gift.value.slice(0, 3);
    console.log("gift: ", gift.value.map((g) => g.name));
  }
}

</script>

<template>
  <div class="justify-center">
    <div v-for="card in props.cards" :key="card.name">
      <div class="bg-white rounded-lg shadow-md overflow-hidden btn-pop px-4 py-2">
        <button @click="selectCard(card, props.selectType)">
          <div class="px-4 py-2">
            <h2 class="text-lg font-medium text-gray-800">{{ card.name }}</h2>
            <p class="text-sm text-gray-500">{{ card.description }}</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
