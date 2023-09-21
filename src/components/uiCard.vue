<script setup lang="ts">
import { ref } from "vue";
import type { Card } from "@/types";
import VLongPress from "./VLongPress.vue";

defineProps<{ card: Card }>();

const dropDown = ref(false);
const onLongPressCallbackHook = (): void => {
  console.log("longPress");
  dropDown.value = true;
};


</script>
<template>
  <div class="block">
    <div v-if="dropDown" class="bg-white rounded fixed z-10">
      <h5>{{ card.name }}</h5>
      <p>{{ card.company }}</p>
      <p>{{ card.description }}</p>
    </div>
    <div class="overCard">
      <VLongPress :delay="1000" :onLongPress="onLongPressCallbackHook">
        <img :src="`/img/companys/${card.company}.png`" />
        <div class="overText text-base">
          <p class="waste">{{ card.waste }}</p>
          <div class="info flex justify-start text-sm">
            <p>{{ "🍖" + card.hungry }} </p>
            <div v-if="card.atk">
              <p>{{ "⚔" + card.atk }}</p>
            </div>
            <div v-if="card.def">
              <p>{{ "🛡" + card.def }}</p>
            </div>
            <div v-if="card.tech">
              <p>{{ "🏹" + card.tech }}</p>
            </div>
            <div v-if="card.priority">
              <p>{{ "🦶 " + card.priority }}</p>
            </div>
            <div v-if="card.heal">
              <p>{{ "💖" + card.heal }}</p>
            </div>
          </div>
        </div>
      </VLongPress>
    </div>
  </div>
</template>