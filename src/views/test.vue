<script setup lang="ts">
import { ref, toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import bianca from "@/assets/img/companys/bianca.png";
import bulbull from "@/assets/img/companys/bulbull.png";
import galdaybee from "@/assets/img/companys/galdaybee.png";
import hanamie from "@/assets/img/companys/hanamie.png";
import norma from "@/assets/img/companys/norma.png";
import rapidpot from "@/assets/img/companys/rapidpot.png";
import unlimit from "@/assets/img/companys/unlimit.png";

//storeの参照
const { id, player } = storeToRefs(playerStore);
const { name, hand } = toRefs(player.value);


</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Test</h1>
    <div>
      <p class="text-sm font-medium text-gray-900 truncate">id:{{ id }}</p>
      <p class="text-sm font-medium text-gray-900 truncate">name:{{ name }}</p>
    </div>
    <div v-for="card in hand" :key="card.id" class="max-w-3xl">
      <p>{{ card.id }}</p>
    </div>
  </div>
</template>
