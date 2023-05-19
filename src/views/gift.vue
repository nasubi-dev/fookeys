<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getGiftData } from "@/server/usePlayerID";
import type { Gift } from "@/types";
import Select from "@/components/select.vue";

const gifts = ref<Gift[]>([]);
onMounted(async () => {
  gifts.value = await getGiftData();
});
//! 同じgiftを選択できないようにする
</script>

<template>
  <Select :cards="gifts" selectType="gift" />
</template>
