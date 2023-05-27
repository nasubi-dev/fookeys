<script setup lang="ts">
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";

const { player, sumCardsField } = storeToRefs(playerStore);
const { field } = player.value;

</script>

<template>
  <div>
    <ul class="text-xs flex justify-start">
      <div v-for="(card) in field" :key="card.id">
        <div class="w-30 h-30 bg-gray-100 rounded-lg p-4 flex flex-col justify-center items-center">
          <h5 class="text-bold">name:{{ card.name }}</h5>
          <p class="text-gray-600">ID:{{ card.id }}</p>
          <p class="text-gray-600">📊🚬:{{ card.company }}</p>
          <p class="text-gray-600">{{ "🍃:" + card.waste + "🍖: " + card.hungry + "🦶: " + card.priority }}</p>
          <div v-if="card.pow">
            <p class="text-gray-600">{{ "⚔:" + card.pow }}</p>
          </div>
          <div v-if="card.def">
            <p class="text-gray-600">{{ "🛡:" + card.def }}</p>
          </div>
          <div v-if="card.tech">
            <p class="text-gray-600">{{ "🏹:" + card.tech }}</p>
          </div>
        </div>
      </div>
    </ul>
    {{ sumCardsField }}
  </div>
</template>
