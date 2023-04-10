<script setup lang="ts">
import { ref } from 'vue';
import { startMatchmaking } from '@/server/useUserID';
import { useUserStore } from '@/store';

const userInfo = useUserStore();


//マッチングを開始する
async function startMatch() {
	if (!userInfo.id) {
		alert('ユーザーIDがありません');
		return;
	}
	const waitingUser = await startMatchmaking(userInfo.id)
	if (waitingUser) {
		console.log('マッチ成功!相手ID:', waitingUser)
		//waitingUserのIDのユーザーはマッチ成功というログが出ない。ここ関数作る？
	} else {
		console.log('マッチング待機中...')
	}
}
</script>

<template>
	<div class="h-screen bg-gray-100 flex flex-col">
		<router-link to="/">
			<button class="p-4 absolute top-4 left-4 bg-blue-500 text-white rounded-md">
				戻る
			</button>
		</router-link>

		{{ userInfo }}

		<div class="flex flex-1">
			<div class="w-1/2 flex items-center justify-center">
				<img src="../../public/nasubi.png" class="max-h-full max-w-full">
			</div>

			<div class="w-1/2 p-8 flex flex-col justify-center">
				<button class="p-4 bg-blue-500 text-white rounded-md mb-4" @click="startMatch">エントリー</button>
				<router-link to="/character" class="p-4 bg-blue-500 text-white rounded-md mb-4">
					<button class=" text-white rounded-md ">キャラ選択</button>
				</router-link>
				<router-link to="/gift" class="p-4 bg-blue-500 text-white rounded-md mb-4">
					<button>ギフト選択</button>
				</router-link>
			</div>
		</div>

	</div>
</template>