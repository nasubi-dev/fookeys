<script setup lang="ts">
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import type { Card } from "@/types";

const { cardLock } = storeToRefs(playerStore);

defineProps<{
  cards: Card[];
  value: number | string;
  after: number | string;
}>();

</script>
<template>
  <div>
    <div class="overCard flex justify-start">
      <div v-for="card in (cards.map((card) => { if (card.attribute === after) { return card } }))" :key="card?.id">
        <div v-if="card" class="overCard" style="width: 15vw;">
          <img :src="`/img/companys/${card.company}.png`" />
          <div class="overText">
            <p class="waste">{{ card.waste }}</p>
            <div class="info flex justify-start">
              <p>{{ "🍖" + card.hungry }} </p>
              <div v-if="card.atk">
                <p>{{ "⚔:" + card.atk }}</p>
              </div>
              <div v-if="card.def">
                <p>{{ "🛡:" + card.def }}</p>
              </div>
              <div v-if="card.tech">
                <p>{{ "🏹:" + card.tech }}</p>
              </div>
              <div v-if="card.priority">
                <p>{{ "🦶: " + card.priority }}</p>
              </div>
              <div v-if="card.heal">
                <p>{{ "💖:" + card.heal }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="cardLock" class="overText">
        <div v-if="after === 'hungry'" class=" text-lg">{{ value ? "行動不能✖" : "行動可能✔" }}</div>
        <div v-if="after === 'def' && value" class=" text-5xl font-bold text-fuchsia-600">{{ "🛡:" + value }}</div>
        <div v-if="after === 'atk' && value" class=" text-5xl font-bold text-fuchsia-600">{{ "⚔:" + value }}</div>
        <div v-if="after === 'tech' && value" class="text-5xl font-bold text-fuchsia-600">{{ "🏹:" + value }}</div>
        <!-- <div v-if="after === 'hungry' || 'sup'" class=" text-lg font-bold text-fuchsia-600">????????????????????</div> -->
      </div>
    </div>
  </div>
</template>
