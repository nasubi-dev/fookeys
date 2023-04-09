<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { registerUser,deleteUser, updateUserName, startMatchmaking } from '@/server/useUserID';

const name = ref('');
const newName = ref('No name');
const userID = ref('');

//アプリが起動したらユーザーIDを取得する
onMounted(() => {
	async function register() {
		userID.value = await registerUser();
	}
	console.log('アプリが起動しました')
	register();
})

//なんか起動しない
//アプリが終了したらユーザーIDを削除する
onUnmounted(async () => {
  console.log('アプリが終了しました')
	await deleteUser(userID.value);
})

//ユーザー名を変更する
async function updateName() {
	if (!userID.value) {
		alert('ユーザーIDがありません');
		return;
	}
	newName.value = await updateUserName(userID.value, name.value);
}

//マッチングを開始する
async function startMatch() {
	if (!userID.value) {
		alert('ユーザーIDがありません');
		return;
	}
	const waitingUser = await startMatchmaking(userID.value)
	if (waitingUser) {
		console.log('マッチ成功!相手ID:', waitingUser)
		//waitingUserのIDのユーザーはマッチ成功というログが出ない。ここ関数作る？
	} else {
		console.log('マッチング待機中...')
	}
}
</script>

<template>
	<div class="flex flex-col items-center justify-center h-screen">
		<h1 class="text-4xl font-bold mb-4">Home</h1>

		<form class="flex flex-col items-center" @submit.prevent="updateName">
			<label class="mb-2">
				<span class="text-xl font-bold">Name:</span>
				<input class="border border-gray-400 rounded-lg p-2 w-64" type="text" v-model="name" />
			</label>
			<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2" type="submit">
				Rename
			</button>
		</form>

		<div class="mt-4">
			<div>
				<span class="text-xl font-bold">Your ID:</span>
				<span class="text-xl">{{ userID }}</span>
			</div>
			<div>
				<span class="text-xl font-bold">Your Name:</span>
				<span class="text-xl">{{ newName }}</span>
			</div>
		</div>

			<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2" @click="startMatch">
				対戦開始
			</button>

	</div>
</template>