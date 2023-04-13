<script setup lang="ts">
import { startMatchmaking } from '@/server/usePlayerID';
import { usePlayerStore } from '@/store';

const playerStore = usePlayerStore();

//マッチングを開始する
async function startMatch() {
	if (playerStore.id == null) {
		alert('ユーザーIDが取得できていません。')
		return
	}
	const waitingPlayer = await startMatchmaking(playerStore.id)
	if (waitingPlayer) {
		console.log('マッチ成功!相手ID:', waitingPlayer)
		//waitingPlayerのIDのユーザーはマッチ成功というログが出ない。ここ関数作る？
	} else {
		console.log('マッチング待機中...')
		//再起して待機を作る？
	}
}
</script>

<template>
	<div class="h-screen flex flex-col">
		<router-link to="/">
			<button class="p-4 absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md btn-pop">
				戻る
			</button>
		</router-link>

		{{ playerStore }}

		<div class="flex flex-1">
			<div class="w-1/2 flex items-center justify-center">
				<img src="../assets/nasubi.png" class="max-h-full max-w-full">
			</div>


		</div>

	</div>
</template>