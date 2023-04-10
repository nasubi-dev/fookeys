<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store';

const userInfo = useUserStore();

const cards = [
	{
		id: 0,
		name: 'character 0',
		image: './public/nasubi.png',
		description: 'test test test test',
		action: () => {
			userInfo.character = 0;
		},
	},
	{
		id: 1,
		name: 'character 1',
		image: './public/nasubi.png',
		description: 'test test test test',
		action: () => {
			userInfo.character = 1;

		},
	},
	{
		id: 2,
		name: 'character 2',
		image: './public/nasubi.png',
		description: 'test test test test',
		action: () => {
			userInfo.character = 2;
		},
	},
	{
		id: 3,
		name: 'character 3',
		image: './public/nasubi.png',
		description: 'test test test test',
		action: () => {
			userInfo.character = 3;
		},
	},
	{
		id: 4,
		name: 'character 4',
		image: './public/nasubi.png',
		description: 'test test test test',
		action: () => {
			userInfo.character = 4;
		},
	},
	{
		id: 5,
		name: 'character 5',
		image: './public/nasubi.png',
		description: 'test test test test',
		action: () => {
			userInfo.character = 5;
		},
	},
	{
		id: 6,
		name: 'character 6',
		image: './public/nasubi.png',
		description: 'test test test test',
		action: () => {
			userInfo.character = 6;
		},
	},
	{
		id: 7,
		name: 'character 7',
		image: './public/nasubi.png',
		description: 'test test test test',
		action: () => {
			userInfo.character = 7
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
				<button @click="card.action">
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