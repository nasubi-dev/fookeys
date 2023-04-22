<script setup lang="ts">
import { usePlayerStore } from "@/store";

const playerStore = usePlayerStore();
</script>
<template>
			<div class="flex justify-end">
			<ul class="divide-y divide-gray-200">
				<li class="py-4">
					<p class="text-sm font-medium text-gray-900 truncate">id:{{ playerStore.id }}</p>
				</li>
				<li class="py-4">
					<p class="text-sm font-medium text-gray-900 truncate">idEnemy:{{ playerStore.idEnemy }}</p>
				</li>
				<li class="py-4">
					<p class="text-sm font-medium text-gray-900 truncate">idGame:{{ playerStore.idGame }}</p>
				</li>
				<li class="py-4">
					<p class="text-sm font-medium text-gray-900 truncate">name:{{ playerStore.name }}</p>
				</li>
				<li class="py-4">
					<p class="text-sm font-medium text-gray-900 truncate">character:{{ playerStore.character }}</p>
				</li>
				<li class="py-4">
					<p class="text-sm font-medium text-gray-900 truncate">gift:{{ playerStore.gift }}</p>
				</li>
			</ul>
		</div>
</template>