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


		<div class="flex flex-1">


			<div class="w-1/2 p-8 flex flex-col justify-center">
				<button class="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md mb-4 btn-pop"
					@click="startMatch">エントリー</button>

				<router-link to="/character" class="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md mb-4 btn-pop">
					<button class=" text-white rounded-md">キャラ選択</button>
				</router-link>

				<router-link to="/gift" class="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md mb-4 btn-pop">
					<button class=" text-white rounded-md">ギフト選択</button>
				</router-link>
			</div>
		</div>

	</div>
</template>