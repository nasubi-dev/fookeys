<script setup lang="ts">
import { ref } from 'vue';
import { startMatchmaking } from '@/server/useUserID';

const userID = ref("");

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
		<h1 class="text-4xl font-bold mb-4">Menu</h1>

		<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2" @click="startMatch">
			Matchmaking
		</button>

		<router-link to="/" class="mt-4">
			<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2">
				Home
			</button>
		</router-link>
	</div>
</template>