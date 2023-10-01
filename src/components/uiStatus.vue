<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { playerStore, gameStore, enemyPlayerStore } from "@/main";
import { storeToRefs } from "pinia";
import statusImg from "@/assets/img/ui/status.png";
import nasubiImg from "@/assets/img/nasubi.png";

const { player, components, battleResult, sign } = storeToRefs(playerStore);
const { status, sumFields } = toRefs(player.value);
const { enemyPlayer } = storeToRefs(enemyPlayerStore);
const { game } = toRefs(gameStore);
const { firstAtkPlayer } = toRefs(game.value);

const retainedDef = ref<number | undefined>();
watch(battleResult, (newVal) => {
  if (newVal[0] === 'def') {
    if (firstAtkPlayer.value === sign.value) {
      if (components.value === 'primaryAtk' && newVal[1]) retainedDef.value = sumFields.value.def
    } else {
      if (components.value === 'secondAtk' && newVal[1]) retainedDef.value = sumFields.value.def
    }
  }
  if (newVal[0] === "atk" && components.value === 'secondAtk') {
    retainedDef.value = sumFields.value.def - enemyPlayer.value.sumFields.atk
    retainedDef.value = retainedDef.value < 0 ? 0 : retainedDef.value
  }
  if (newVal[0] === 'none' && components.value === 'secondAtk') {
    retainedDef.value = undefined
  }
})
</script>

<template>
  <div class="overCard mt-auto" style="width:50dvw;">
    <img :src="statusImg" />
    <div class="overText w-full">
      <div class="flex justify-start w-full transform -translate-y-4">
        <div class="overCard">
          <img :src="nasubiImg" class="w-36 inline-block ml-4" />
          <div class="overText font-bold text-5xl align-text-bottom">{{ retainedDef }}</div>
        </div>
        <p class="font-bold text-3xl mt-auto ml-auto mr-6">
          ❤:{{ status.hp + "/" + status.maxHp }}
          🍖:{{ status.hungry + "/" + status.maxHungry }}
          🪙:{{ status.contribution }}
        </p>
      </div>

    </div>
  </div>
</template>
