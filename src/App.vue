<script setup lang="ts">
import { RouterView } from 'vue-router'
import { registerPlayer, deletePlayer } from '@/server/usePlayerID';
import { usePlayerStore } from '@/store';

const PlayerStore = usePlayerStore();

//アプリが起動したらユーザーIDを取得する
window.onload = async () => {
	PlayerStore.id = await registerPlayer();
	console.log('アプリが起動しました')
}

//アプリが閉じられたらユーザーIDを削除する
window.onbeforeunload = async () => {
	window.onbeforeunload = () => {};
	console.log('アプリが終了しました')
	await deletePlayer(PlayerStore.id);
}
</script>

<template>
  <div class="bg-gray-600 h-screen">
  <RouterView />
  </div>
</template>