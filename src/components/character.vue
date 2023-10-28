<script setup lang="ts">
import { ref, toRefs, watch, onMounted } from "vue";
import { playerStore, gameStore } from "@/main";
import { wait, XOR } from "@/server/utils";
import { storeToRefs } from "pinia";

const p = defineProps<{ status: "my" | "enemy" }>()

const { components, battleResult, sign } = storeToRefs(playerStore);
const { game } = storeToRefs(gameStore);
const { firstAtkPlayer } = toRefs(game.value)

const characterName = ref("blankiss")

onMounted(async () => {
  await wait(1)
  const characterAllocation = !XOR(p.status === "my", sign.value === 0)// X-NOR
  characterName.value = characterAllocation ? "blankiss" : "petit&spot"
})

const retainedDef = ref<number>(0);
const reactionImg = ref<string>("normal");
watch(battleResult, (newVal) => {
  if (typeof newVal[1] !== "number") return
  const isPrimaryAtk = components.value === "primaryAtk"
  const isChangingValue = !XOR(firstAtkPlayer.value === sign.value, p.status === "my")// X-NOR
  const attackOrder = !XOR(isPrimaryAtk, isChangingValue)// X-NOR

  if (attackOrder) {
    if (newVal[0] === "def") {
      reactionImg.value = "def"
      retainedDef.value = newVal[1]
    } else if (newVal[0] === "atk" || newVal[0] === "tech") {
      reactionImg.value = "atk"
    }
  } else {
    if (newVal[0] === "atk") {
      reactionImg.value = "damage"
      retainedDef.value -= isPrimaryAtk ? 0 : newVal[1]
      if (retainedDef.value < 0) retainedDef.value = 0
    }
  }

  //初期化
  if (newVal[0] === "none") {
    if (!isPrimaryAtk) retainedDef.value = 0
    reactionImg.value = "normal"
  }
})
</script>

<template>
  <div class="overCard w-1/4">
    <img :src="`/img/characters/${characterName}/${reactionImg}.png`" />
    <div v-if="retainedDef" class="overText font-bold text-5xl text-red-500">{{ retainedDef }}</div>
  </div>
</template>
