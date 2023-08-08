<script setup lang="ts">
import { toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import sumFieldImg from "@/assets/img/ui/info.png";

const { sumCards } = storeToRefs(playerStore);
</script>

<template>
  <div>
    <div class="overCard">
      <img :src="sumFieldImg" />
      <div class="overText">
        {{ sumCards }}
      </div>
    </div>
  </div>
</template>