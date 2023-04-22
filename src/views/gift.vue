<script setup lang="ts">
import { usePlayerStore } from '@/store';
import type { Gifts } from '@/types';
import  Select  from '@/components/select.vue'
import nasubi from '@/assets/nasubi.png';

const playerStore = usePlayerStore();

const gifts:Gifts = [
	{
		name: 'gift 0',
		description: 'test test test test',
		image: nasubi,
		action: () => {
			playerStore.gift = 0;
		},
	},
	{
		name: 'gift 1',
		description: 'test test test test',
		image: nasubi,
		action: () => {
			playerStore.gift = 1;
		},
	},
	{
		name: 'gift 2',
		description: 'test test test test',
		image: nasubi,
		action: () => {
			playerStore.gift = 2;
		},
	},
	{
		name: 'gift 3',
		description: 'test test test test',
		image: nasubi,
		action: () => {
			playerStore.gift = 3;
		},
	},
	{
		name: 'gift 4',
		description: 'test test test test',
		image: nasubi,
		action: () => {
			playerStore.gift = 4;
		},
	},
	{
		name: 'gift 5',
		description: 'test test test test',
		image: nasubi,
		action: () => {
			playerStore.gift = 5;
		},
	},
	{
		name: 'gift 6',
		description: 'test test test test',
		image: nasubi,
		action: () => {
			playerStore.gift = 6;
		},
	},
	{
		name: 'gift 7',
		description: 'test test test test',
		image: nasubi,
		action: () => {
			playerStore.gift = 7;
		},
	},
]
</script>

<template>
	<Select :cards=gifts />
</template>