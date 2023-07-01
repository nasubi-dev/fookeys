<script setup lang="ts">
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";

const { offer2Hand } = playerStore;
const { phase, isOfferSelected, offer } = storeToRefs(playerStore);
</script>

<template>
  <div>
    <div v-if="phase === 'shop'">
        <button @click="offer2Hand(isOfferSelected)" class="bg-white">選択確定</button>
        {{ isOfferSelected }}
      <ul class="text-xs flex justify-start">
        <div v-for="(card, index) in offer" :key="card.id">
          <button @click="isOfferSelected[index] = !isOfferSelected[index]">
            <div :class="isOfferSelected[index] ? 'bg-red-100' : 'bg-blue-100'"
              class="w-30 h-30 rounded-lg p-4 flex flex-col justify-center items-center">
              <h5 class="text-bold">{{ card.name }}</h5>
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
          </button>
        </div>
      </ul>
    </div>
  </div>
</template>
