<script setup lang="ts">
import { toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import sumFieldImg from "@/assets/img/ui/info.png";

const { sumCards } = storeToRefs(playerStore);
</script>

<template>
  <div>
    <div class="overCard" style="width: 35dvw;">
      <img :src="sumFieldImg" />
      <div class="overText">
        <div class="flex justify-start">
          <p>{{ "0️⃣"+ sumCards.num }}</p>
          <p>{{ "🍃" + sumCards.waste }}</p>
          <p>{{ "🍖" + sumCards.hungry }} </p>
          <p>{{ "⚔:" + sumCards.atk }}</p>
          <p>{{ "🛡:" + sumCards.def }}</p>
          <p>{{ "🏹:" + sumCards.tech }}</p>
          <p>{{ "🦶: " + sumCards.priority }}</p>
          <p>{{ "💖:" + sumCards.heal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>