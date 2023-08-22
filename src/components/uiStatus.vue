<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { playerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";
import allCharacters from "@/assets/allCharacters";
import statusImg from "@/assets/img/ui/status.png";

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
  <div class="overCard" style="width:50dvw;">
    <img :src="statusImg" class="block" />
    <div class="overText text-sm font-medium text-gray-900" style="width:50dvw;">
      <div class="status font-bold text-3xl mt-auto">
        <!-- name:{{ name }}
        {{ allCharacters[player.character].name }} -->
        ❤:{{ status.hp + "/" + (600 + (allCharacters[character].maxHp ?? 0)) }}
        🍖:{{ status.hungry + "/" + (200 + (allCharacters[character].maxHungry ?? 0)) }}
        🪙:{{ status.contribution }}
      </div>
    </div>
    <div class="overText">
      <div class="font-bold text-5xl mr-auto ml-5 transform -translate-x-48 translate-y-6">{{ retainedDef }}</div>
    </div>
  </div>
</template>
