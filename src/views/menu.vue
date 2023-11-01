<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { e, s, i } from "@/log";
import { storeToRefs } from "pinia";
import { playerStore } from "@/main";
import { useSound } from "@vueuse/sound";
import { tap1, tap2 } from "@/assets/sounds";
import { startMatchmaking } from "@/server/useMatchMaking";
//components
import SelectCharacter from "@/components/selectCharacter.vue";
import SelectGifts from "@/components/selectGifts.vue";
import UiGifts from "@/components/uiGifts.vue";
//img
import characterBackground from "@/assets/img/ui/characterBackground.png";
import menuBackground from "@/assets/img/ui/menuBackground.png";
import back from "@/assets/img/ui/back.png";

import { usePush } from 'notivue'
const push = usePush()

const { player, log, id } = storeToRefs(playerStore);
const { gifts, character } = toRefs(player.value);

watch(log, (newVal) => {
  if (newVal) push.info(newVal)
})

const useTap1 = useSound(tap1);
const useTap2 = useSound(tap2);

const selectGift = ref(false);
const selectCharacter = ref(false);
async function startMatch(): Promise<void> {
  if (!id.value) {
    push.error("IDがありません｡")
    return
  }
  await startMatchmaking();
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="z-10">
      <router-link v-if="!selectCharacter && !selectGift" to="/">
        <button @click="useTap2.play()" class="p-4 absolute top-4 left-4 btn-pop">
          <img :src="back" class="w-32" />
        </button>
      </router-link>
      <button v-else class="p-4 absolute top-4 left-4 btn-pop"
        @click="selectCharacter = false; selectGift = false; useTap2.play()">
        <img :src="back" class="w-32" />
      </button>
    </div>

    <div class="flex flex-1">
      <div class="overCard w-1/2 p-8 flex flex-col justify-center items-center text-center">
        <img :src="characterBackground" />
        <div class="overText items-center ">
          <img :src="`/img/characters/${character}/normal.png`" class="w-1/2" />
          <div class="flex justify-start w-1/2">
            <UiGifts :gifts="gifts" :player="player" />
          </div>
        </div>
      </div>

      <div class="w-1/2 flex flex-col justify-center text-center items-center">
        <SelectCharacter v-if="selectCharacter" />
        <SelectGifts v-else-if="selectGift" />
        <div v-else class="overCard ">
          <img :src="menuBackground" class="h-full" />
          <div class="overText">
            <button @click="startMatch(); useTap1.play()" class="btn-pop">
              <img src="@/assets/img/ui/entry.png" />
            </button>
            <button @click="selectGift = !selectGift; useTap1.play()" class="btn-pop">
              <img src="@/assets/img/ui/changeGift.png" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
