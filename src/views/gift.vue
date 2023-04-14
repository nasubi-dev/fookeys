<script setup lang="ts">
import  Select  from '@/components/select.vue'
import { usePlayerStore } from '@/store';

const playerStore = usePlayerStore();

const gift = [
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
	<Select :cards=gift />
</template>