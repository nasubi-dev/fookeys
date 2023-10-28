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
const retainedDef = ref<number>(0);
const reactionImg = ref<string>("normal");

onMounted(async () => {
  await wait(1)
  const characterAllocation = !XOR(p.status === "my", sign.value === 0)// X-NOR
  characterName.value = characterAllocation ? "blankiss" : "petit&spot"
})

watch(battleResult, (newVal) => {
  if (typeof newVal[1] !== "number") return

  const isPrimaryAtk = components.value === "primaryAtk"
  const changingValueAllocation = !XOR(firstAtkPlayer.value === sign.value, p.status === "my")// X-NOR
  if (components.value === "primaryAtk") {
    if (changingValueAllocation) {
      if (newVal[0] === "def") {
        reactionImg.value = "def"
        retainedDef.value = newVal[1]
      } else if (newVal[0] === "atk") {
        reactionImg.value = "atk"
      }//!techやsupのときも追加する
    } else {
      if (newVal[0] === "atk") {
        reactionImg.value = "damage"
        if (retainedDef.value < 0) retainedDef.value = 0
      } else if (newVal[0] === "tech") {
        reactionImg.value = "damage"
      }
    }
  } else if (components.value === "secondAtk") {
    if (!changingValueAllocation) {
      if (newVal[0] === "def") {
        reactionImg.value = "def"
        retainedDef.value = newVal[1]
      } else if (newVal[0] === "atk") {
        reactionImg.value = "atk"
      }
    } else {
      if (newVal[0] === "atk") {
        reactionImg.value = "damage"
        retainedDef.value -= newVal[1]
        if (retainedDef.value < 0) retainedDef.value = 0
      } else if (newVal[0] === "tech") {
        reactionImg.value = "damage"
      }
    }
    if (newVal[0] === "none") retainedDef.value = 0
  }
  if (newVal[0] === "none") reactionImg.value = "normal"
})
</script>

<template>
  <div class="overCard w-1/4">
    <img :src="`/img/characters/${characterName}/${reactionImg}.png`" />
    <div v-if="retainedDef" class="overText font-bold text-5xl text-red-500">{{ retainedDef }}</div>
  </div>
</template>
