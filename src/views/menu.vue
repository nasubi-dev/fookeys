<script setup lang="ts">
import { useRouter } from 'vue-router';
import nasubi from '@/assets/nasubi.png';
import { usePlayerStore } from '@/store';
import { startMatchmaking } from '@/server/usePlayerID';

const playerStore = usePlayerStore();

//マッチングを開始する
async function startMatch(PlayerID: string): Promise<void> {
	if (PlayerID == null) {
		alert('ユーザーIDが取得できていません。')
		return
	}
	const [waitingPlayer, gameID] = await startMatchmaking(PlayerID);
	if (waitingPlayer && gameID) {
		console.log('マッチ成功!相手ID:', waitingPlayer)
		router.push({ name: 'battle', params: { gameID } });
		//waitingPlayerのIDのユーザーはマッチ成功というログが出ない。ここ関数作る？
	} else {
		console.log('マッチング待機中...')
		//再起して待機を作る？
	}
}

const router = useRouter();
</script>

<template>
	<div class="h-screen flex flex-col">
		<router-link to="/">
			<button class="p-4 absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md btn-pop">
				戻る
			</button>
		</router-link>

		<div class="flex justify-end">
			<ul class="divide-y divide-gray-200">
				<li class="py-4">
					<p class="text-sm font-medium text-gray-900 truncate">id:{{ playerStore.id }}</p>
				</li>
				<li class="py-4">
					<p class="text-sm font-medium text-gray-900 truncate">name:{{ playerStore.name }}</p>
				</li>
				<li class="py-4">
					<p class="text-sm font-medium text-gray-900 truncate">character:{{ playerStore.character }}</p>
				</li>
				<li class="py-4">
					<p class="text-sm font-medium text-gray-900 truncate">gift:{{ playerStore.gift }}</p>
				</li>
			</ul>
		</div>

		<div class="flex flex-1">
			<div class="w-1/2 flex items-center justify-center">
				<img :src=nasubi class="max-h-full max-w-full" />
			</div>

			<div class="w-1/2 p-8 flex flex-col justify-center">
				<button class="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md mb-4 btn-pop"
					@click="startMatch(playerStore.id)">エントリー</button>

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