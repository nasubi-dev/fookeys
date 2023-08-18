<script setup lang="ts">
import { e, s, i } from "@/log";
import type { PlayerData } from "@/types";
import uiCardBehind from "./uiCardBehind.vue";
import allCharacters from "@/assets/allCharacters";
import infoImg from "@/assets/img/ui/info.png";

defineProps<{
  p: PlayerData;
}>();

</script>
<template>
  <div style="width: 20vw;">
    <div class="overCard">
      <img :src="infoImg" />
      <div class="overText">
        <div class="flex justify-start">
          <p>{{ allCharacters[p.character].name }}</p>
          <p>{{ "🍖" + p.sumFields.hungry }} </p>
          <p v-if="p.sumFields.priority">{{ "🦶: " + p.sumFields.priority }}</p>
        </div>
      </div>
    </div>

    <uiCardBehind :cards="p.field" />

  </div>
</template>