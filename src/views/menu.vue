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
<h1>menu</h1>
</template>