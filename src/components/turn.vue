<script setup lang="ts">
import { toRefs } from "vue";
import { gameStore } from "@/main";
import { storeToRefs } from "pinia";

const { game } = storeToRefs(gameStore);
const { turn } = toRefs(game.value)
</script>

<template>
    <div class="turn">
        <img src="@/assets/Osu.png">
        <p>turn{{ turn }}</p>
    </div>
</template>
