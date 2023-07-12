<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { deletePlayer } from "@/server/usePlayerID";
import { tryOnBeforeUnmount } from "@vueuse/core";


onMounted(async () => {
  console.log("マウントされました");
});

//アプリが閉じられたらユーザーIDを削除する
tryOnBeforeUnmount(async () => {
  await deletePlayer();
  console.log("アンマウントされました");
});

//ピンチアウト禁止
const touchHandler = (event: any) => {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
};
document.addEventListener('touchstart', touchHandler, {
  passive: false
});

//テキスト選択禁止
document.onselectstart = function() {
  return false;
}
</script>

<template>
  <div id="noContextMenu" class="bg-gray-600 h-screen" style="user-select: none;">
    <RouterView />
  </div>
</template>
