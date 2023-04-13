<script setup lang="ts">
import { usePlayerStore } from '@/store';

const playerStore = usePlayerStore();

const cards = [
	{
		id: 0,
		name: 'gift 0',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.gift = 0;
		},
	},
	{
		id: 1,
		name: 'gift 1',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.gift = 1;
		},
	},
	{
		id: 2,
		name: 'gift 2',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.gift = 2;
		},
	},
	{
		id: 3,
		name: 'gift 3',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.gift = 3;
		},
	},
	{
		id: 4,
		name: 'gift 4',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.gift = 4;
		},
	},
	{
		id: 5,
		name: 'gift 5',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.gift = 5;
		},
	},
	{
		id: 6,
		name: 'gift 6',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.gift = 6;
		},
	},
	{
		id: 7,
		name: 'gift 7',
		image: './src/assets/nasubi.png',
		description: 'test test test test',
		action: () => {
			playerStore.gift = 7;
		},
	},
]
</script>

<template>
	<div class="flex items-center justify-between px-8 py-8 bg-white">
		<router-link to="/menu">
			<button class="p-4 absolute top-4 left-4 bg-blue-500 text-white rounded-md">
				戻る
			</button>
		</router-link>
	</div>
	<div class="mt-8 mx-4 grid grid-cols-4 gap-2">
		<div v-for="card in cards" :key="card.id">
			<div class="bg-white rounded-lg shadow-md overflow-hidden">
				<button @click="card.action" class="btn-pop">
					<img :src="card.image" class="w-full h-64 object-cover">
					<div class="px-4 py-2">
						<h2 class="text-lg font-medium text-gray-800">{{ card.name }}</h2>
						<p class="text-sm text-gray-500">{{ card.description }}</p>
					</div>
				</button>
			</div>
		</div>
	</div>
</template>