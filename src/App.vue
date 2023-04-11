<script setup lang="ts">
import { RouterView } from 'vue-router'
import { registerUser, deleteUser } from '@/server/useUserID';
import { useUserStore } from '@/store';

const userStore = useUserStore();

//アプリが起動したらユーザーIDを取得する
window.onload = async () => {
	userStore.id = await registerUser();
	console.log('アプリが起動しました')
}

//アプリが終了したらユーザーIDを削除する
window.onunload = async () => {
	console.log('アプリが終了しました')
	await deleteUser(userStore.id);
}
</script>

<template>
  <div class="bg-gray-600 h-screen">
  <RouterView />
  </div>
</template>