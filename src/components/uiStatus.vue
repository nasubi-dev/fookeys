<script setup lang="ts">
import Character from "./character.vue";
import statusImg from "@/assets/img/ui/status.png";
import type { PlayerData } from "@/types";

defineProps<{ player: PlayerData }>()

</script>

<template>
  <div class="overCard mt-auto" style="width:50dvw;">
    <img :src="statusImg" />
    <div class="overText w-full">
      <div class="flex justify-start w-full transform -translate-y-4">
        <Character status="my" />
        <p class="font-bold text-3xl mt-auto ml-auto mr-6">
          ❤:{{ player.status.hp + "/" + player.status.maxHp }}
          🍖:{{ player.status.hungry + "/" + player.status.maxHungry }}
          🪙:{{ player.status.contribution }}
        </p>
      </div>
    </div>
  </div>
</template>
