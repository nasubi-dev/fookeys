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
  <div v-for="(card, index) in cards" :key="card.id">
    <button class=img-button @click="sendTest(index)">
      <h5 class="card-name">{{ card.name }}</h5>
      <p class="card-ID">{{ card.id }}</p>
      <p class="card-company">{{ card.company }}</p>
      <p class="card-hungry">{{ card.waste + card.hungry }}</p>
      <div v-if="card.pow">
        <p class="card-attribute">{{ card.pow }}</p>
      </div>
      <div v-if="card.def">
        <p class="card-attribute">{{ card.def }}</p>
      </div>
      <div v-if="card.tech">
        <p class="card-attribute">{{ card.tech }}</p>
      </div>
    </button>
  </div>
</template>

<style>
.card-name{
  text-align: center;
}

.card-ID{
  position: absolute;
  top: 0;
  left: 0;
}

.card-company{
  position: absolute;
  top: 0;
  right: 0;
}

.card-hungry{
  position: absolute;
  bottom: 0;
  left: 0;
}

.card-attribute{
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>