<script setup lang="ts">
import { onMounted, toRefs } from "vue";
import { playerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";

const { id, data } = storeToRefs(playerStore);
const { game } = storeToRefs(gameStore);
const {turn } =toRefs(game.value)
const { idGame, character, gift, status, hand, field, sign } = toRefs(data.value);
console.log(id.value);
</script>

<template>
    <div class="box">
        <img src="../../src/assets/Osu.png">
        <p>turn{{ turn }}</p>
    </div>
</template>

<style>
.box{
    position: relative;
    max-width: 50%;
    max-height: 50%;
}
.box p{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    }
</style>
