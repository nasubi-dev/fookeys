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


	</div>
</template>