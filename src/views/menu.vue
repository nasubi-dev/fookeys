<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { e, s, i } from "@/log";
import { storeToRefs } from "pinia";
import { playerStore } from "@/main";
import { startMatchmaking } from "@/server/useMatchMaking";
import SelectCharacter from "@/components/selectCharacter.vue";
import SelectGifts from "@/components/selectGifts.vue";
import nasubi from "@/assets/img/nasubi.png";
import notYet from "@/assets/img/notYet.png";
import allCharacters from "@/assets/allCharacters";
import allGifts from "@/assets/allGifts";

import { usePush } from 'notivue'
const push = usePush()

const { player, log } = storeToRefs(playerStore);
const { gifts, character } = toRefs(player.value);
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
    <router-link to="/">
      <button class="p-4 absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md btn-pop">
        戻る
      </button>
    </router-link>

    <div class="flex flex-1">
      <div class="w-1/2 p-8 flex flex-col justify-center">
        <img :src="nasubi" class="w-1/2" />
        <div>
          {{ "character: " + allCharacters[character].name }}
        </div>
        <div>
          {{ "gift1: " + allGifts[gifts[0]].name }}
          {{ "gift2: " + allGifts[gifts[1]].name }}
          {{ "gift3: " + allGifts[gifts[2]].name }}
        </div>

        <button @click="push.success('text')">success</button>
        <button
          @click="push.info('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')">long</button>
        <button @click="push.error({ title: 'error', message: 'error rrrrrrrrrrrrrrrr \n rrrrrrrr', })">error</button>
      </div>

      <div v-if="selectCharacter">
        <SelectCharacter />
        <button @click="selectCharacter = !selectCharacter" class="text-white rounded-md">
          text
        </button>
      </div>
      <div v-else-if="selectGift">
        <SelectGifts />
        <button @click="selectGift = !selectGift" class="text-white rounded-md">
          text
        </button>
      </div>
      <div v-else class="w-1/2 p-8 flex flex-col justify-center">
        <button @click="startMatch" class="btn-pop">
          <img src="@/assets/img/ui/entry.png" class=" w-1/2" />
        </button>
        <button  class="text-white rounded-md overCard">
          <img src="@/assets/img/ui/changeCharacter.png" class=" w-1/2" />
          <div class="overText">
            <img :src="notYet" class="h-auto w-1/4" />
          </div>
        </button>
        <button class="text-white rounded-md overCard">
          <img src="@/assets/img/ui/changeGift.png" class=" w-1/2" />
          <div class="overText">

            <img :src="notYet" class="h-auto w-1/4" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
