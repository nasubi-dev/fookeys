<script setup lang="ts">
import { watch, ref } from "vue";
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import type { PlayerData } from "@/types";
import uiCardBehind from "./uiCardBehind.vue";
import allCharacters from "@/assets/allCharacters";
import infoImg from "@/assets/img/ui/info.png";

const { components, battleResult } = storeToRefs(playerStore);

const p = defineProps<{
  player: PlayerData;
  which: "primary" | "second";
}>();

const isShowSup = ref(true);
const isShowDef = ref(true);
const isShowAtk = ref(true);
const isShowTech = ref(true);
watch(battleResult, (newVal) => {
  if (newVal[0] === 'sup' && components.value.includes(p.which)) {
    isShowSup.value = false;
  }
  if (newVal[0] === 'def' && components.value.includes(p.which)) {
    isShowDef.value = false;
  }
  if (newVal[0] === 'atk' && components.value.includes(p.which)) {
    isShowAtk.value = false;
  }
  if (newVal[0] === 'tech' && components.value.includes(p.which)) {
    isShowTech.value = false;
  }
});
</script>
<template>
  <transition enter-from-class="translate-y-[-150%] opacity-0" leave-to-class="translate-x-[-150%] opacity-0"
    leave-active-class="transition duration-300" enter-active-class="transition duration-300">
    <div style="width: 20vw;" class=" animate-slide-in-top">
      <div class="flex justify-start">
        <div class="overCard">
          <img :src="infoImg" />
          <div class="overText">
            <div class="flex justify-start">
              <p>{{ allCharacters[p.player.character].name }}</p>
              <p>{{ "🍖" + p.player.sumFields.hungry }} </p>
              <p v-if="p.player.sumFields.priority">{{ "🦶: " + p.player.sumFields.priority }}</p>
            </div>
          </div>
        </div>

        <div>
          <div v-if="p.player.donate">donate</div>
          <div v-else>battle</div>
        </div>
      </div>

      <div class="flex justify-start">
        <uiCardBehind v-show="isShowSup" :cards="p.player.field" :attribute="'sup'" />
        <uiCardBehind v-show="isShowDef" :cards="p.player.field" :attribute="'def'" />
        <uiCardBehind v-show="isShowAtk" :cards="p.player.field" :attribute="'atk'" />
        <uiCardBehind v-show="isShowTech" :cards="p.player.field" :attribute="'tech'" />
      </div>
    </div>
  </transition>
</template>