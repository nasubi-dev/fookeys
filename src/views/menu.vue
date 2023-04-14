<script setup lang="ts">
import { startMatchmaking } from '@/server/usePlayerID';
import nasubi from '@/assets/nasubi.png';
import { usePlayerStore } from '@/store';

const playerStore = usePlayerStore();

//マッチングを開始する
async function startMatch(PlayerID:string): Promise<void> {
	if (PlayerID == null) {
		alert('ユーザーIDが取得できていません。')
		return
	}
	const waitingPlayer = await startMatchmaking(PlayerID)
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


	</div>
</template>