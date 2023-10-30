<script setup lang="ts">
import { ref, toRefs, watch, onMounted } from "vue";
import { playerStore, gameStore } from "@/main";
import { wait, XOR } from "@/server/utils";
import { storeToRefs } from "pinia";

const p = defineProps<{ status: "my" | "enemy" }>()
const emit = defineEmits<{
  (event: "isWiggle", reactionImg: string): void
}>()


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
    } else if (newVal[0] === "tech") {
      reactionImg.value = "damage"
    }
  }

  //初期化
  if (newVal[0] === "none") {
    if (!isPrimaryAtk) retainedDef.value = 0
    reactionImg.value = "normal"
  }
  emit("isWiggle", reactionImg.value)
})
</script>

<template>
  <div class="overCard w-1/4 animate-rotate-y animate-once animate-delay-100">
    <img :src="`/img/characters/${characterName}/${reactionImg}.png`" />
    <div v-show="retainedDef" class="fixed inset-0 top-2/3 font-bold text-5xl text-red-500"
      :class="[p.status === 'my' ? `text-5xl` : `text-2xl`, reactionImg === 'def' ? `animate-jump` : null]">{{ "🛡" +
        retainedDef }}</div>
  </div>
</template>
