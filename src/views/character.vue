<script setup lang="ts">
import { onMounted,ref } from "vue";
import type { Character } from "@/types";
import { getCharacterData } from "@/server/usePlayerID";
import Select from "@/components/select.vue";

const characters= ref<Character[]>([]);
onMounted(async () => {
  characters.value = await getCharacterData();
});
</script>

<template>
  <Select :cards="characters" type="character" />
</template>
