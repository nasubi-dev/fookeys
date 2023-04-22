<script setup lang="ts">
import { useBattle } from '@/server/useBattle';
import { usePlayerStore } from '@/store';

const playerStore = usePlayerStore();

//入場したらPlayer型としてIDが保管される
async function battle(idGame:string) {
	const result = await useBattle(idGame);
	if (result) {
		console.log(result);
		
	}
}

</script>

<template>
	<div class="flex flex-col items-center justify-center h-screen">
		<h1>Battle</h1>
		<button @click="battle(playerStore.idGame)">Battle</button>
		{{battle.idGame}}
		{{battle.idPlayer}}

	</div>
</template>