<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { registerUser, updateUserName, startMatchmaking } from '@/server/useUserID';

const name = ref('');
const userID = ref('');

onMounted(() => {
	console.log('アプリが起動しました')
})

async function register() {
	userID.value = await registerUser(name.value);
}

async function updateName() {
	if (!userID.value) {
		alert('ユーザーIDがありません');
		return;
	}
	await updateUserName(userID.value, name.value);
}

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

		<form class="flex flex-col items-center" @submit.prevent="register">
			<label class="mb-2">
				<span class="text-xl font-bold">Name:</span>
				<input class="border border-gray-400 rounded-lg p-2 w-64" type="text" v-model="name" />
			</label>
			<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2" type="submit">
				Register
			</button>
		</form>

		<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2" @click="updateName">
			Rename
		</button>

		<div class="mt-4">
			<span class="text-xl font-bold">Your ID:</span>
			<span class="text-xl">{{ userID }}</span>
		</div>

		<form class="flex flex-col items-center" @submit.prevent="startMatch">
			<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2" type="submit">
				対戦開始
			</button>
		</form>

	</div>
</template>