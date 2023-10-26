<script setup lang="ts">
import { ref, toRefs, watch, onMounted } from "vue";
import { playerStore, gameStore, enemyPlayerStore } from "@/main";
import { wait, XOR } from "@/server/utils";
import { storeToRefs } from "pinia";

const p = defineProps<{ status: "my" | "enemy" }>()

const { player, components, battleResult, sign } = storeToRefs(playerStore);
const { sumFields } = toRefs(player.value);
const { enemyPlayer } = storeToRefs(enemyPlayerStore);
const { sumFields: enemySumField } = toRefs(enemyPlayer.value);
const { game } = toRefs(gameStore);
const { firstAtkPlayer } = toRefs(game.value);

const characterName = ref("blankiss")
onMounted(async () => {
  await wait(1)
  const a = XOR(p.status === "my", sign.value === 0)
  characterName.value = a ? "blankiss" : "petit&spot"
})

const test = (firstAtkPlayer.value === sign.value)
const c = XOR(!(firstAtkPlayer.value === sign.value), (components.value === 'primaryAtk'))
const retainedDef = ref<number>(0);
watch(battleResult, (newVal) => {
  // if (!c) return
  if (newVal[0] === 'def') {
    retainedDef.value = p.status === "my" ? sumFields.value.def : enemySumField.value.def
  }
  if (newVal[0] === "atk") {
    retainedDef.value = sumFields.value.def - enemySumField.value.atk
    if (retainedDef.value < 0) retainedDef.value = 0
  }

})
watch(components, (newVal) => {
  if (newVal === 'postBattle') {
    retainedDef.value = 0
  }
})


</script>

<template>
  <div class="overCard w-1/4">
    <img v-if="battleResult[0] === 'atk'" :src="`/img/characters/${characterName}/atk.png`" />
    <img v-else :src="`/img/characters/${characterName}/normal.png`" />
    <div class="overText font-bold text-5xl align-text-bottom text-red-500">{{ retainedDef }}</div>
  </div>
</template>
