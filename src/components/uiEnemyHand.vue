<script setup lang="ts">
import type { Card } from "@/types";

defineProps<{ cards: Card[] }>();

</script>

<template>
  <div>
    <ul class="text-xs flex justify-start">
      <div v-for="(card) in cards" :key="card.id">
        <img :src="`/img/companysBack/${card.company}.png`" class=" w-14 h-14" />
      </div>
    </ul>
  </div>
</template>