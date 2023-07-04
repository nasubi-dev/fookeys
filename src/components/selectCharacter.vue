<script setup lang="ts">
import { toRefs } from "vue";
import type { Character } from "@/types";
import { storeToRefs } from "pinia";
import { playerStore } from "@/main";
import allCharacters from "@/assets/allCharacters";

const { player } = storeToRefs(playerStore);
const { character } = toRefs(player.value);

function selectCharacter(card: Character) {
    character.value = card.id;
    console.log("character: " + allCharacters[character.value].name);
}

</script>

<template>
    <div class="justify-center">
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
</template>
