<script setup lang="ts">
import { useBattle } from '@/server/useBattle';
import { usePlayerStore } from '@/store';

const playerStore = usePlayerStore();

//入場したらPlayer型としてIDが保管される

</script>

<template>
	<div class="flex flex-col items-center justify-center h-screen">
		<h1>Battle</h1>
		{{ playerStore }}

	</div>
</template>