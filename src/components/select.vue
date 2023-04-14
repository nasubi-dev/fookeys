<script setup lang="ts">

defineProps<{
	cards: {
		id: number;
		name: string;
		description: string;
		image: string;
		action: () => void;
	}[];
}>();


</script>

<template>
	<div>
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
	</div>
</template>