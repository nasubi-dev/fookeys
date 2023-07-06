<script setup lang="ts">
import { toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import card1 from "@/assets/img/card1.png";

const { player, sumCards } = storeToRefs(playerStore);
const { field } = toRefs(player.value);

</script>

<template>
  <div>
    <ul class="text-xs flex justify-start">
      <div v-for="(card) in field" :key="card.id">
        <div class="card">
          <img :src=card1 class="cardImg w-30 h-30" />
          <div class="cardText w-30 h-30 p-4 flex flex-col justify-center items-center">
            <h5 class="text-bold">name:{{ card.name }}</h5>
            <p class="text-gray-600">ID:{{ card.id }}</p>
            <p class="text-gray-600">📊🚬:{{ card.company }}</p>
            <p class="text-gray-600">{{ "🍃:" + card.waste + "🍖: " + card.hungry + "🦶: " + card.priority }}</p>
            <div v-if="card.atk">
              <p class="text-gray-600">{{ "⚔:" + card.atk }}</p>
            </div>
            <div v-if="card.def">
              <p class="text-gray-600">{{ "🛡:" + card.def }}</p>
            </div>
            <div v-if="card.tech">
              <p class="text-gray-600">{{ "🏹:" + card.tech }}</p>
            </div>
          </div>
        </div>
      </div>
    </ul>
    {{ sumCards }}
  </div>
</template>