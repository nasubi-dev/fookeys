<script setup lang="ts">
import { usePlayerStore } from '@/store';
import type { Gifts } from '@/types';
import { updatePlayerField } from "@/server/useMatchMaking";
import  Select  from '@/components/select.vue'
import nasubi from '@/assets/nasubi.png';

const playerStore = usePlayerStore();

const updateGift = async (gift: number) => {
	await updatePlayerField(playerStore.id, 'gift', gift);
};

const gifts:Gifts = [
	{
		name: 'gift 1',
		description: 'test test test test',
		image: nasubi,
		action: () => updateGift(1),
	},
	{
		name: 'gift 2',
		description: 'test test test test',
		image: nasubi,
		action: () => updateGift(2),
	},
	{
		name: 'gift 3',
		description: 'test test test test',
		image: nasubi,
		action: () => updateGift(3),
	},
	{
		name: 'gift 4',
		description: 'test test test test',
		image: nasubi,
		action: () => updateGift(4),
	},
	{
		name: 'gift 5',
		description: 'test test test test',
		image: nasubi,
		action: () => updateGift(5),
	},
	{
		name: 'gift 6',
		description: 'test test test test',
		image: nasubi,
		action: () => updateGift(6),
	},
	{
		name: 'gift 7',
		description: 'test test test test',
		image: nasubi,
		action: () => updateGift(7),
	},
	{
		name: 'gift 8',
		description: 'test test test test',
		image: nasubi,
		action: () => updateGift(8),
	},
]
</script>

<template>
	<Select :cards=gifts />
</template>