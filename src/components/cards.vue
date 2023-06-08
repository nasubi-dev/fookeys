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
    <div v-for="(card, index) in cards" :key="card.id">
      <div class="box">
        <button class=img-button @click="sendTest(index)">
          <img src="../../src/assets/card1.png">
          <div class="ovwelay">
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
      </div>
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