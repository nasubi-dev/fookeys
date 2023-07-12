<script setup lang="ts">
import { ref, toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";

//storeの参照
const { id, player } = storeToRefs(playerStore);
const { name, hand } = toRefs(player.value);

const msg = ref("Hello World");
//LeftClickとRightClickの判定
const clickLeft = (e: MouseEvent) => {
  e.preventDefault();
  msg.value = "LeftClick";
  console.log("LeftClick");
};
const clickRight = (e: MouseEvent) => {
  e.preventDefault();
  msg.value = "RightClick";
  console.log("RightClick");
};

</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Test</h1>
    <div>
      <p class="text-sm font-medium text-gray-900 truncate">id:{{ id }}</p>
      <p class="text-sm font-medium text-gray-900 truncate">name:{{ name }}</p>
    </div>
    {{ msg }}
    <button @click.left.prevent="clickLeft" @click.right.prevent="clickRight">Click Me!!!</button>
  </div>
</template>
