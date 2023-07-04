<script setup lang="ts">
import { toRefs } from "vue";
import { playerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";

const { phase } = storeToRefs(playerStore);
const { game } = storeToRefs(gameStore);
const { turn } = toRefs(game.value)
</script>

<template>
    <div class="turn">
        <img src="@/assets/img/Osu.png">
        <div class="turnText">
            <p>turn: {{ turn }}</p>
            <p>phase: {{ phase }}</p>
        </div>
    </div>
</template>
