<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { deletePlayer } from "@/server/usePlayerID";


onMounted(async () => {
  console.log("マウントされました");
});

//アプリが閉じられたらユーザーIDを削除する
window.onbeforeunload = async () => {
  window.onbeforeunload = null;
  await deletePlayer();
  console.log("アプリが終了しました");
};
</script>

<template>
  <div class="bg-gray-600 h-screen">
    <RouterView />
  </div>
</template>
