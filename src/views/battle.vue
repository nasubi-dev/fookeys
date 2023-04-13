<script setup lang="ts">
import { ref } from 'vue';
import { updatePlayerName } from '@/server/usePlayerID';
import { usePlayerStore } from '@/store';

const playerStore = usePlayerStore();

</script>

<template>
	<div class="flex flex-col items-center justify-center h-screen">
		<h1 class="text-4xl font-bold mb-4">Home</h1>

	</div>
</template>