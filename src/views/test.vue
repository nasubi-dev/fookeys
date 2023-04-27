<script setup lang="ts">
import { testStore } from "@/main";
import { storeToRefs } from "pinia";
const { test } = storeToRefs(testStore);
</script>

<template>
  <div class="h-screen flex flex-col">
		{{ "test: " + testStore.test }}<br/>
    {{ "test: " + test }}
    <button @click="testStore.updateTest">update</button>
  </div>
</template>
