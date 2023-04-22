<script setup lang="ts">
import  Select  from '@/components/select.vue'
import nasubi from '@/assets/nasubi.png';
import { usePlayerStore } from '@/store';
import type { Characters } from '@/types';

const playerStore = usePlayerStore();

const characters:Characters = [
	{
		name: 'character 0',
		description: 'test test test test',
		image: nasubi,
		company: 'test',
		action: () => {
			playerStore.character = 0;
		},
	},
	{
		name: 'character 1',
		description: 'test test test test',
		image: nasubi,
		company: 'test',
		action: () => {
			playerStore.character = 1;

		},
	},
	{
		name: 'character 2',
		description: 'test test test test',
		image: nasubi,
		company: 'test',
		action: () => {
			playerStore.character = 2;
		},
	},
	{
		name: 'character 3',
		description: 'test test test test',
		image: nasubi,
		company: 'test',
		action: () => {
			playerStore.character = 3;
		},
	},
	{
		name: 'character 4',
		description: 'test test test test',
		image: nasubi,
		company: 'test',
		action: () => {
			playerStore.character = 4;
		},
	},
	{
		name: 'character 5',
		description: 'test test test test',
		image: nasubi,
		company: 'test',
		action: () => {
			playerStore.character = 5;
		},
	},
	{
		name: 'character 6',
		description: 'test test test test',
		image: nasubi,
		company: 'test',
		action: () => {
			playerStore.character = 6;
		},
	},
	{
		name: 'character 7',
		description: 'test test test test',
		image: nasubi,
		company: 'test',
		action: () => {
			playerStore.character = 7
		},
	},
]

</script>

<template>
	<Select :cards="characters" />
</template>