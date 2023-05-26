<script setup lang="ts">
import { ref } from "vue";
import type { Card } from "@/types";

const isSelected = ref<boolean[]>([false, false, false, false, false, false, false, false, false]);
defineProps<{
  cards: Card[];
}>();

const emit = defineEmits(["pushCard", "popCard"]);

const pushCard = (index: number) => {
  isSelected.value[index] = !isSelected.value[index]
  emit("pushCard", index);
};

const popCard = (index: number, card: Card) => {
  isSelected.value[index] = !isSelected.value[index]
  emit("popCard", index, card);
};

</script>

<template>
  <div>
    <ul class="text-xs flex justify-start">
      <div v-for="(card, index) in cards" :key="card.id">
        <button @click="!isSelected[index] ? pushCard(index) : popCard(index, card)">
          <div :class="isSelected[index] ? 'bg-red-100' : 'bg-blue-100'"
            class="w-30 h-30 rounded-lg p-4 flex flex-col justify-center items-center">
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
    {{ isSelected }}
  </div>
</template>
