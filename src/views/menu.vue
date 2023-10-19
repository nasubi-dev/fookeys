<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { e, s, i } from "@/log";
import { storeToRefs } from "pinia";
import { playerStore } from "@/main";
import { useSound } from "@vueuse/sound";
import { tap1, tap2 } from "@/assets/sounds";
import { startMatchmaking } from "@/server/useMatchMaking";
import SelectCharacter from "@/components/selectCharacter.vue";
import SelectGifts from "@/components/selectGifts.vue";
import nasubi from "@/assets/img/nasubi.png";



import { usePush } from 'notivue'
const push = usePush()

const { player, log } = storeToRefs(playerStore);
const { gifts, character } = toRefs(player.value);

const useTap1 = useSound(tap1);
const useTap2 = useSound(tap2);

const selectGift = ref(false);
const selectCharacter = ref(false);

//マッチングを開始する
//マッチングが成功したら後で押したほうがPlayer1､Player2
async function startMatch(): Promise<void> {
  await startMatchmaking();
}

watch(log, (newVal) => {
  if (newVal) push.info(newVal)
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <router-link v-if="!selectCharacter && !selectGift" to="/">
      <button @click="useTap2.play()"
        class="p-4 absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md btn-pop">
        戻る
      </button>
    </router-link>
    <div v-else>
      <button @click="selectCharacter = false; selectGift = false; useTap2.play()"
        class="p-4 absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md btn-pop">
        メニューへ戻る
      </button>
    </div>

    <div class="flex flex-1">
      <div class="w-1/2 p-8 flex flex-col justify-center text-center items-center">
        <img :src="nasubi" class="w-1/2" />
        se-sakusya
        <div class="flex justify-start w-1/2">
          <div v-for=" gift  in  gifts " :key="gift">
            <img :src="`./img/gifts/${gift}.png`" />
          </div>
        </div>
      </div>

      <div class="w-1/2 flex flex-col justify-center text-center items-center">
        <SelectCharacter v-if="selectCharacter" />
        <SelectGifts v-else-if="selectGift" />
        <div v-else class="w-1/2">
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
</template>
