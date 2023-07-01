<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getCharacterData, getGiftData } from "@/server/usePlayerID";
import { startMatchmaking } from "@/server/useMatchMaking";
import { storeToRefs } from "pinia";
import { playerStore } from "@/main";
import type { Character, Gift } from "@/types";
import Select from "@/components/select.vue";
import nasubi from "@/assets/nasubi.png";

const { player } = storeToRefs(playerStore);

//マッチングを開始する
//マッチングが成功したら後で押したほうがPlayer1､Player2
async function startMatch(): Promise<void> {
  await startMatchmaking();
}

const characters = ref<Character[]>([]);
const gifts = ref<Gift[]>([]);
onMounted(async () => {
  characters.value = await getCharacterData();
  gifts.value = await getGiftData();
});

const selectGift = ref(false);
const selectCharacter = ref(false);

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
          {{ "character: " + player.character.name }}
        </div>
        <div>
          {{ "gift1: " + player.gift[0].name }}
          {{ "gift2: " + player.gift[1].name }}
          {{ "gift3: " + player.gift[2].name }}
        </div>
      </div>

      <div v-if="selectCharacter">
        <Select :cards="characters" selectType="character"/>
      </div>
      <div v-else-if="selectGift">
        <Select :cards="gifts" selectType="gift" />
      </div>
      <div v-else class="w-1/2 p-8 flex flex-col justify-center">
        <button @click="startMatch" class="btn-pop">
          <img src="@/assets/matchMaking.png" class="w-1/2" />
        </button>
        <button @click="selectCharacter = !selectCharacter" class="text-white rounded-md">
          <img src="@/assets/characterChange.png" class="w-1/2" />
        </button>
        <button @click="selectGift = !selectGift" class="text-white rounded-md">
          <img src="@/assets/giftChange.png" class="w-1/2" />
        </button>
      </div>
    </div>
  </div>
</template>
