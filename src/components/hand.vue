<script setup lang="ts">
import { ref } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";

const { player } = storeToRefs(playerStore);
const { pushHand, popHand } = playerStore;
const { hand } = player.value;

const isSelected = ref<boolean[]>([]);

//HandからFieldへ
const pushCard = (index: number) => {
  if(isSelected.value[index]) throw new Error("failed to pushCard");
  isSelected.value[index] = !isSelected.value[index]
  pushHand(index)
};
//FieldからHandへ
const popCard = (index: number, id: number) => {
  if(!isSelected.value[index]) throw new Error("failed to popCard");
  isSelected.value[index] = !isSelected.value[index]
  popHand(index, id)
};

</script>

<template>
  <div>
    <ul class="text-xs flex justify-start">
      <div v-for="(card, index) in hand" :key="card.id">
        <button @click="!isSelected[index] ? pushCard(index) : popCard(index, card.id)">
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
