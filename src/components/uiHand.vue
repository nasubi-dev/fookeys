<script setup lang="ts">
import { toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";

const { pushHand, popHand } = playerStore;
const { player, isHandSelected, cardLock } = storeToRefs(playerStore);
const { hand } = toRefs(player.value);

//HandからFieldへ
const pushCard = (index: number) => {
  if (cardLock.value) return;
  if (isHandSelected.value[index]) throw new Error("failed to pushCard");
  isHandSelected.value[index] = !isHandSelected.value[index]
  pushHand(index)
};
//FieldからHandへ
const popCard = (index: number, id: number) => {
  if (cardLock.value) return;
  if (!isHandSelected.value[index]) throw new Error("failed to popCard");
  isHandSelected.value[index] = !isHandSelected.value[index]
  popHand(index, id)
};
//!寄付のときFieldにカードを追加しない処理が必要
</script>

<template>
  <div>
    <ul class="text-xs flex justify-start">
      <div v-for="(card, index) in hand" :key="card.id">
        <div v-if="!card.rotten">
          <button @click="!isHandSelected[index] ? pushCard(index) : popCard(index, card.id)">
            <div :class="isHandSelected[index] ? 'bg-red-100' : 'bg-blue-100'"
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
        <div v-else>
          <div :class="isHandSelected[index] ? 'bg-red-100' : 'bg-blue-100'"
            class="w-30 h-30 rounded-lg p-4 flex flex-col justify-center items-center">
            <h5 class="text-bold">腐ってます!!!!!</h5>
          </div>
        </div>
      </div>
    </ul>
    {{ isHandSelected }}
  </div>
</template>
