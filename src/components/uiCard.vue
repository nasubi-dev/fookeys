<script setup lang="ts">
import { ref } from "vue";
import type { Card } from "@/types";
import VDuringPress from "./VDuringPress.vue";

defineProps<{ card: Card }>();

const dropDown = ref(false);
const onLongPressCallbackHook = (): void => {
  console.log("longPress");
  dropDown.value = true;
};
const onKeyUpCallbackHook = (): void => {
  dropDown.value = false;
};


</script>
<template>
  <div class="block" style="user-select: none;">
    <div v-if="dropDown" class="bg-white rounded fixed z-10 p-2 text-left transform"
      :class="card.description ? ' -translate-y-16' : '-translate-y-10'">
      <p>{{ card.company + " : " + card.name }}</p>
      <p>{{ card.description }}</p>
    </div>
    <div class="overCard">
      <VDuringPress :onKeyDown="onLongPressCallbackHook" :onKeyUp="onKeyUpCallbackHook" :delay="500">
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
      </VDuringPress>
    </div>
  </div>
</template>