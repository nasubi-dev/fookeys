<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { deletePlayer } from "@/server/usePlayerData";
import { tryOnBeforeUnmount } from "@vueuse/core";
import { Notivue, Notifications } from 'notivue'

onMounted(async () => {
  console.log("マウントされました");
});

//アプリが閉じられたらユーザーIDを削除する//!反応しない
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
document.addEventListener('touchstart', touchHandler, { passive: false });
//テキスト選択禁止
document.onselectstart = function () {
  return false;
}
//テキスト選択禁止
document.onselectstart = function() {
  return false;
}
//スクロール禁止
function disableScroll(event: any) {
  event.preventDefault();
}
// イベントと関数を紐付け
document.addEventListener('touchmove', disableScroll, { passive: false });
</script>

<template>
  <div id="noContextMenu" class="background">
    <Notivue v-slot="item">
      <Notifications :item="item" />
    </Notivue>
    <RouterView />
  </div>
</template>
