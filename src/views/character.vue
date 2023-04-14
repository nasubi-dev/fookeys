<script setup lang="ts">
import  Select  from '@/components/select.vue'
import { usePlayerStore } from '@/store';

const playerStore = usePlayerStore();

const character = [
	{
		id: 0,
		name: 'character 0',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.character = 0;
		},
	},
	{
		id: 1,
		name: 'character 1',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.character = 1;

		},
	},
	{
		id: 2,
		name: 'character 2',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.character = 2;
		},
	},
	{
		id: 3,
		name: 'character 3',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.character = 3;
		},
	},
	{
		id: 4,
		name: 'character 4',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.character = 4;
		},
	},
	{
		id: 5,
		name: 'character 5',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.character = 5;
		},
	},
	{
		id: 6,
		name: 'character 6',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.character = 6;
		},
	},
	{
		id: 7,
		name: 'character 7',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.character = 7
		},
	},
]

</script>

<template>
	<Select :cards=character />
</template>