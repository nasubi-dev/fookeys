<script setup lang="ts">
import { ref } from 'vue';
import { registerUser, deleteUser, updateUserName } from '@/server/useUserID';
import { useUserStore } from '@/store';

const userInfo = useUserStore();

//アプリが起動したらユーザーIDを取得する
//合ってるかわからん
window.addEventListener("load", async () => {
	userInfo.id = await registerUser();
	console.log('アプリが起動しました')
})

//アプリが終了したらユーザーIDを削除する
window.addEventListener("beforeunload", async () => {
	console.log('アプリが終了しました')
	await deleteUser(userInfo.id);
});

//ユーザー名を変更する
const newName = ref("No name");
async function updateName() {
	if (!userInfo.id) {
		alert('ユーザーIDがありません');
		return;
	}
	newName.value = await updateUserName(userInfo.id, userInfo.name);
}
</script>

<template>
	<div class="flex flex-col items-center justify-center h-screen">
		<h1 class="text-4xl font-bold mb-4">Home</h1>

		<form class="flex flex-col items-center" @submit.prevent="updateName">
			<label class="mb-2">
				<input class="border border-gray-400 rounded-lg p-2 w-64" type="text" placeholder="please name"
					v-model="userInfo.name" />
			</label>
			<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2" type="submit">
				Rename
			</button>
		</form>

		<div class="mt-4">
			<div>
				<span class="text-xl font-bold">Your ID:</span>
				<span class="text-xl">{{ userInfo.id }}</span>
			</div>
			<div>
				<span class="text-xl font-bold">Your Name:</span>
				<span class="text-xl">{{ newName }}</span>
			</div>
		</div>

		<router-link to="/menu" class="mt-4">
			<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2">
				Menu
			</button>
		</router-link>
	</div>
</template>