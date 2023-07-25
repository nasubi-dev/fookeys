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
document.addEventListener('touchstart', touchHandler, {
  passive: false
});
//テキスト選択禁止
document.onselectstart = function () {
  return false;
}
</script>

<template>
  <div id="noContextMenu" class="background" style="user-select: none;">
    <Notivue v-slot="item">
      <Notifications :item="item" />
    </Notivue>
    <RouterView />
  </div>
</template>
