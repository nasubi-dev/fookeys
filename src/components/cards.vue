<script setup lang="ts">
import type { Card } from "@/types";

defineProps<{
  cards: Card[];
}>();

const emit = defineEmits(["sendText"]);

const sendTest = (index: number) => {
  emit("sendText", index);
};

</script>

<template>
  <div>
    <ul class="text-xs flex justify-start">
      <div v-for="(card, index) in cards" :key="card.id">
        <button @click="sendTest(index)">
          <div class="w-30 h-30 bg-gray-100 rounded-lg p-4 flex flex-col justify-center items-center">
            <h5 class="text-bold">name:{{ card.name }}</h5>
            <p class="text-gray-600">ID:{{ card.id }}</p>
            <p class="text-gray-600">📊🚬:{{ card.company }}</p>
            <p class="text-gray-600">{{ "🍃:" + card.waste + "🍖: " + card.hungry }}</p>

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
</template>
