<script setup lang="ts">
import { ref, toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { onClickOutside } from '@vueuse/core'

//storeの参照
const { id, player } = storeToRefs(playerStore);
const { name, hand } = toRefs(player.value);

const el = ref()

const msg = ref("Hello World");
const dropDown = ref(false);

const close = () => {
  dropDown.value = false
}

onClickOutside(el, close)
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Test</h1>
    <div>
      <p class="text-sm font-medium text-gray-900 truncate">id:{{ id }}</p>
      <p class="text-sm font-medium text-gray-900 truncate">name:{{ name }}</p>
    </div>
    {{ msg }}
    <div ref="el" v-if="dropDown">
      <p>dropDown</p>
    </div>
    <button @click.left.prevent="dropDown = true">Click Me!!!</button>
  </div>
</template>
