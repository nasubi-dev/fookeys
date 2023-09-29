<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { playerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";
import statusImg from "@/assets/img/ui/status.png";
import nasubiImg from "@/assets/img/nasubi.png";

const { player, components, battleResult, sign } = storeToRefs(playerStore);
const { name, character, status } = toRefs(player.value);
const { game } = toRefs(gameStore);
const { firstAtkPlayer } = toRefs(game.value);

const retainedDef = ref<number | undefined>();
watch(battleResult, (newVal) => {
  if (newVal[0] === 'def' && typeof newVal[1] === 'number') {
    if (firstAtkPlayer.value === sign.value) {
      if (components.value === 'primaryAtk' && newVal[1]) retainedDef.value = newVal[1];
    } else {
      if (components.value === 'secondAtk' && newVal[1]) retainedDef.value = newVal[1];
    }
  }//!あとでもっといい方法考える
  if ((newVal[0] === 'atk' && components.value === 'secondAtk') || (newVal[0] === 'none' && components.value === 'secondAtk')) {//!変更タイミング帰るかも
    retainedDef.value = undefined;
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
