<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { usePush, Notivue, Notifications, filledIcons } from 'notivue'
import { useSound } from "@vueuse/sound";
import { storeToRefs } from "pinia";
import { playerStore } from "@/main";
import { e, s, i } from "@/log";
import { startMatchmaking } from "@/server/useMatchMaking";
import { tap1, tap2 } from "@/assets/sounds";
//components
import SelectCharacter from "@/components/selectCharacter.vue";
import SelectGifts from "@/components/selectGifts.vue";
import UiGifts from "@/components/uiGifts.vue";
import myLogImg from "@/components/myLog.vue";
import enemyLogImg from "@/components/enemyLog.vue";
//img
import characterBackground from "@/assets/img/ui/characterBackground.png";
import menuBackground from "@/assets/img/ui/menuBackground.png";
import back from "@/assets/img/ui/back.png";

const customIcons = {
  success: myLogImg,
  error: enemyLogImg,
  info: filledIcons.info,
  close: filledIcons.close,
  promise: filledIcons.promise
}
const push = usePush()

const { player, log, id } = storeToRefs(playerStore);
const { gifts, character } = toRefs(player.value);

watch(log, () => {
  if (log.value === "") return
  push.info({
    message: log.value,
    duration: 8000,
  })
  log.value = ""
})

const useTap1 = useSound(tap1);
const useTap2 = useSound(tap2);

const selectGift = ref(false);
const selectCharacter = ref(false);
async function startMatch(): Promise<void> {
  if (!id.value) {
    push.error("IDがありません")
    return
  }
  await startMatchmaking();
}
</script>

<template>
  <div>
    <Notivue v-slot="item">
      <Notifications :item="item" :icons="customIcons" />
    </Notivue>
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
            <img :src="`/img/characters/${character}/normal.png`" />
            <div class="flex justify-start w-1/2">
              <UiGifts :gifts="gifts" :player="player" />
            </div>
          </div>
        </div>

        <div class="w-1/2 px-3 flex flex-col justify-center text-center items-center">
          <div class="overCard">
            <img :src="menuBackground" class="h-screen" />
            <div v-if="!selectCharacter && !selectGift" class="overText w-full">
              <button @click="startMatch(); useTap1.play()" class="btn-pop my-4">
                <img src="@/assets/img/ui/entry.png" />
              </button>
              <button @click="selectCharacter = !selectCharacter; useTap1.play()" class="btn-pop my-4">
                <img src="@/assets/img/ui/changeCharacter.png" />
              </button>
              <button @click="selectGift = !selectGift; useTap1.play()" class="btn-pop my-4">
                <img src="@/assets/img/ui/changeGift.png" />
              </button>
            </div>
            <div v-else-if="selectCharacter" class="overText w-full">
              <SelectCharacter />
            </div>
            <div v-else-if="selectGift" class="overText w-full">
              <SelectGifts />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
