<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
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
function handleWindowUnload() {
  deletePlayer(PlayerStore.id);
}
window.addEventListener("beforeunload", handleWindowUnload);
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleWindowUnload);
});
</script>

<template>
  <div class="bg-gray-600 h-screen">
    <RouterView />
  </div>
</template>
