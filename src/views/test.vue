<script setup lang="ts">
import { useTestStore } from "@/store";
import { storeToRefs } from "pinia";
const testStore = useTestStore();
const { test } = storeToRefs(testStore);
</script>

<template>
  <div class="h-screen flex flex-col">
		{{ "test: " + testStore.test }}<br/>
    {{ "test: " + test }}
    <button @click="testStore.updateTest">update</button>
  </div>
</template>
