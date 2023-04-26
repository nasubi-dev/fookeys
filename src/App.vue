<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { registerPlayer, deletePlayer } from "@/server/usePlayerID";
import { usePlayerStore } from "@/store";

const PlayerStore = usePlayerStore();

//アプリが起動したらユーザーIDを取得する
//入場したらPlayerData型としてIDが保管される
onMounted(async () => {
  PlayerStore.id = await registerPlayer();
  console.log("マウントされました");
});

//アプリが閉じられたらユーザーIDを削除する
window.onbeforeunload = async () => {
  window.onbeforeunload = null;
  await deletePlayer(PlayerStore.id);
  console.log("アプリが終了しました");
};
</script>

<template>
  <div class="bg-gray-600 h-screen">
    <RouterView />
  </div>
</template>
