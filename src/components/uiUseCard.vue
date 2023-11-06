<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import type { PlayerData, PlayerSign } from "@/types";
import uiCardBehind from "./uiCardBehind.vue";
import infoImg from "@/assets/img/ui/info.png";
import battleImg from "@/assets/img/ui/battle.png"
import donateImg from "@/assets/img/ui/donate.png"
import { getEnemyPlayer } from "@/server/usePlayerData";

const { battleResult } = storeToRefs(playerStore);

const p = defineProps<{
  player: PlayerData;
  enemyCharacter: string;
  firstAtkPlayer: PlayerSign | undefined;
}>();

const characterName = ref("")
onMounted(async () => {
  await getEnemyPlayer();
  characterName.value = p.firstAtkPlayer === 1 ? p.player.character : p.enemyCharacter
})

const isShowHeal = ref(true);
const isShowSup = ref(true);
const isShowDef = ref(true);
const isShowAtk = ref(true);
const isShowTech = ref(true);
watch(battleResult, (newVal) => {
  if (newVal[0] === 'donate') {
    isShowHeal.value = false;
    isShowSup.value = false;
    isShowDef.value = false;
    isShowAtk.value = false;
    isShowTech.value = false;
  }
  if (newVal[0] === 'heal') isShowHeal.value = false;
  if (newVal[0] === 'sup') isShowSup.value = false;
  if (newVal[0] === 'def') isShowDef.value = false;
  if (newVal[0] === 'atk') isShowAtk.value = false;
  if (newVal[0] === 'tech') isShowTech.value = false;
});
</script>

<template>
  <Transition appear enter-from-class="translate-y-[-150%] opacity-0" leave-to-class="translate-x-[-150%] opacity-0"
    leave-active-class="transition duration-300" enter-active-class="transition duration-300">
    <div style="width: 20vw;">
      <div class="overCard flex justify-start">
        <img :src="infoImg" />
        <div class="overText">
          <div class="flex justify-start items-center font-bold text-base">
            <img :src="`/img/characters/${characterName}/normal.png`" class="w-1/3  bottom-5 bg-clip-border" />
            <p>{{ "🍖" + p.player.sumFields.hungry }} </p>
            <p v-if="p.player.sumFields.priority && !p.player.donate">{{ "🦶: " + p.player.sumFields.priority }}</p>
            <div class="ml-auto mr-3 w-5">
              <img v-if="p.player.donate" :src="donateImg" />
              <img v-else :src="battleImg" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap">
        <uiCardBehind v-show="isShowHeal" :cards="p.player.field" :attribute="'heal'" />
        <uiCardBehind v-show="isShowSup" :cards="p.player.field" :attribute="'sup'" />
        <uiCardBehind v-show="isShowDef" :cards="p.player.field" :attribute="'def'" />
        <uiCardBehind v-show="isShowAtk" :cards="p.player.field" :attribute="'atk'" />
        <uiCardBehind v-show="isShowTech" :cards="p.player.field" :attribute="'tech'" />
      </div>
    </div>
  </Transition>
</template>