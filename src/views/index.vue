<script setup lang="ts">
import { ref } from 'vue';
import { updatePlayerName } from '@/server/usePlayerID';
import { usePlayerStore } from '@/store';

const playerStore = usePlayerStore();

//ユーザー名を変更する
const newName = ref("No name");
async function updateName() {
	if (!playerStore.id) {
		alert('ユーザーIDがありません');
		return;
	}
	newName.value = await updatePlayerName(playerStore.id, playerStore.name);
}
</script>

<template>
	<div class="flex flex-col items-center justify-center h-screen">
		<h1 class="text-4xl font-bold mb-4">Home</h1>

		<form class="flex flex-col items-center" @submit.prevent="updateName">
			<label class="mb-2">
				<input class="border border-gray-400 rounded-lg p-2 w-64" type="text" placeholder="please name"
					v-model="playerStore.name" />
			</label>
			<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2 btn-pop" type="submit">
				Rename
			</button>
		</form>

		<div class="mt-4">
			<div>
				<span class="text-xl font-bold">Your ID:</span>
				<span class="text-xl">{{ playerStore.id }}</span>
			</div>
			<div>
				<span class="text-xl font-bold">Your Name:</span>
				<span class="text-xl">{{ newName }}</span>
			</div>
		</div>

		<router-link to="/menu" class="mt-4">
			<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2 btn-pop">
				Menu
			</button>
		</router-link>
	</div>
</template>