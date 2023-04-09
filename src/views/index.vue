<script setup lang="ts">
import { ref } from 'vue';
import { registerUser } from '@/composables/match/useUserID';

const name = ref('');
const userID = ref('');

async function register() {
	userID.value = await registerUser(name.value);
	console.log(userID.value);
}

</script>

<template>
	<div class="flex flex-col items-center justify-center h-screen">
		<h1 class="text-4xl font-bold mb-4">Home</h1>
		<form class="flex flex-col items-center" @submit.prevent="register">
			<label class="mb-2">
				<span class="text-xl font-bold">Name:</span>
				<input class="border border-gray-400 rounded-lg p-2 w-64" type="text" v-model="name" />
			</label>
			<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2" type="submit">
				Register
			</button>
		</form>
		<div class="mt-4">
			<span class="text-xl font-bold">Your ID:</span>
			<span class="text-xl">{{ userID }}</span>
		</div>
	</div>
</template>