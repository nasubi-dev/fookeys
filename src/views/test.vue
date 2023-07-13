<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { onLongPress } from '@vueuse/core'
import { e } from "@/log";

//storeの参照
const { id, player } = storeToRefs(playerStore);
const { name, hand } = toRefs(player.value);


const msg = ref("Hello World");
//LeftClickとRightClickの判定
const clickLeft = () => {
  msg.value = "LeftClick";
  console.log("LeftClick");
};
const clickRight = () => {
  msg.value = "RightClick";
  console.log("RightClick");
};

document.addEventListener('long-press', function (e) {
  console.log(e.target);
  clickRight();
});

</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Test</h1>
    <div>
      <p class="text-sm font-medium text-gray-900 truncate">id:{{ id }}</p>
      <p class="text-sm font-medium text-gray-900 truncate">name:{{ name }}</p>
    </div>
    {{ msg }}
    <button data-long-press-event-delay="500">Click Me!!!</button>
  </div>
</template>
