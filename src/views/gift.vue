<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Gift } from "@/types";
import { getGiftData } from "@/server/usePlayerID";
import Select from "@/components/select.vue";

const gifts = ref<Gift[]>([]);
onMounted(async () => {
  gifts.value = await getGiftData();
});
</script>

<template>
  <Select :cards="gifts" type="gift" />
</template>
