<script setup lang="ts">
import { ref, toRefs, watch, onMounted } from "vue";
import { playerStore, enemyPlayerStore, gameStore } from "@/main";
import { wait, XOR } from "@/server/utils";
import { storeToRefs } from "pinia";
import { s } from "@/log";

const p = defineProps<{ status: "my" | "enemy" }>()

const { player, components, battleResult, sign } = storeToRefs(playerStore);
const { sumFields } = toRefs(player.value);
const { enemyPlayer } = storeToRefs(enemyPlayerStore);
const { game } = storeToRefs(gameStore);
const { firstAtkPlayer } = toRefs(game.value)

const characterName = ref("blankiss")
let a: boolean
onMounted(async () => {
  await wait(1)
  a = !XOR(p.status === "my", sign.value === 0)// X-NOR
  characterName.value = a ? "blankiss" : "petit&spot"
})

const retainedDef = ref<number>(0);
const reactionImg = ref<string>("normal");
watch(battleResult, (newVal) => {
// if (!c) {
//   if (b) {
//     if (newVal[0] === "def") {
//       reactionImg.value = "def"
//       if (p.status === "my") {
//         retainedDef.value = sumFields.value.def;
//       } else {
//         retainedDef.value = enemyPlayer.value.sumFields.def;
//       }
//     } else if (newVal[0] === "atk") {
//       reactionImg.value = "atk"
//     }
//   } else if (newVal[0] === "atk" && typeof newVal[1] === "number") {
//     reactionImg.value = "damage"
//     retainedDef.value -= newVal[1];
//     if (retainedDef.value < 0) retainedDef.value = 0
//   }
// } else {
//   if (b) {
//     if (newVal[0] === "def") {
//       reactionImg.value = "def"
//       if (p.status === "my") {
//         retainedDef.value = sumFields.value.def;
//       } else {
//         retainedDef.value = enemyPlayer.value.sumFields.def;
//       }
//     } else if (newVal[0] === "atk") {
//       reactionImg.value = "atk"
//     }
//   } else if (newVal[0] === "atk" && typeof newVal[1] === "number") {
//     reactionImg.value = "damage"
//     retainedDef.value -= newVal[1];
//     if (retainedDef.value < 0) retainedDef.value = 0
//   }
// }

// //このままだと先行後攻に依存しないため､行動が1/2で逆になる
//   const b = XOR(components.value === "primaryAtk", a)// X-OR
//   if (b) {
//     if (newVal[0] === "def") {
//       reactionImg.value = "def"
//       if (p.status === "my") {
//         retainedDef.value = enemyPlayer.value.sumFields.def;
//       } else {
//         retainedDef.value = sumFields.value.def;
//       }
//     } else if (newVal[0] === "atk") {
//       reactionImg.value = "atk"
//     }
//   } else if (newVal[0] === "atk" && typeof newVal[1] === "number") {
//     reactionImg.value = "damage"
//     retainedDef.value -= newVal[1];
//     if (retainedDef.value < 0) retainedDef.value = 0
//   }
})
watch(components, (newVal) => {
  if (newVal === "postBattle") retainedDef.value = 0
  reactionImg.value = "normal"
})
</script>

<template>
  <div class="overCard w-1/4">
    <img :src="`/img/characters/${characterName}/${reactionImg}.png`" />
    <div class="overText font-bold text-5xl text-red-500">{{ retainedDef }}</div>
  </div>
</template>
