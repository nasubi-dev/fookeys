<script setup lang="ts">
import { toRefs } from "vue";
import type { Character } from "@/types";
import { storeToRefs } from "pinia";
import { playerStore } from "@/main";
import allCharacters from "@/assets/allCharacters";

const { player } = storeToRefs(playerStore);
const { character } = toRefs(player.value);

function selectCharacter(character: Character) {
}

</script>

<template>
    <div class="justify-center">
        <div v-for="character in allCharacters" :key="character.name">
            <button @click="selectCharacter(character)" class="bg-white rounded-lg shadow-md overflow-hidden btn-pop px-4 py-2">
                <div class="px-4 py-2">
                    <h2 class="text-lg font-medium text-gray-800">{{ character.name }}</h2>
                    <p class="text-sm text-gray-500">{{ character.company }}</p>
                    <p class="text-sm text-gray-500">{{ character.description1 }}</p>
                    <p class="text-sm text-gray-500">{{ character.description2 }}</p>
                    <p class="text-sm text-gray-500">{{ character.description3 }}</p>
                </div>
            </button>
        </div>
    </div>
</template>
