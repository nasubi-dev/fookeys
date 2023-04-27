<script setup lang="ts">
import { startMatchmaking } from "@/server/useMatchMaking";
import { playerStore } from "@/main";
import PlayerData from "@/components/playerData.vue";
import nasubi from "@/assets/nasubi.png";

//マッチングを開始する
//マッチングが成功したら後で押したほうがPlayer1､Player2
async function startMatch(PlayerID: string): Promise<void> {
  if (PlayerID == undefined) {
    alert("ユーザーIDが取得できていません。");
    return;
  }
  playerStore.idGame = await startMatchmaking(PlayerID);
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <router-link to="/">
      <button class="p-4 absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md btn-pop">
        戻る
      </button>
    </router-link>

    <PlayerData />

    <div class="flex flex-1">
      <div class="w-1/2 flex items-center justify-center">
        <img :src="nasubi" class="max-h-full max-w-full" />
      </div>

      <div class="w-1/2 p-8 flex flex-col justify-center">
        <button
          class="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md mb-4 btn-pop"
          @click="startMatch(playerStore.id)"
        >
          エントリー
        </button>

        <router-link to="/character" class="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md mb-4 btn-pop">
          <button class="text-white rounded-md">キャラ選択</button>
        </router-link>

        <router-link to="/gift" class="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md mb-4 btn-pop">
          <button class="text-white rounded-md">ギフト選択</button>
        </router-link>
      </div>
    </div>
  </div>
</template>
