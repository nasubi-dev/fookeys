<script setup lang="ts">
import { ref } from 'vue';
import { registerUser, updateMatchStatus } from '../composables/match/userID';

const message = ref(<string>'unti');
const registerID = await registerUser(message.value);
console.log(registerID)

</script>

<template>
	<div>
		<h1>Home</h1>
		<div>
			<span>your name:</span>
			<input type="text" v-model="message" />
			<button @click="$event => registerUser(message)">ユーザー登録</button>
		</div><br />
		<button @click="$event => updateMatchStatus(registerID, 0)">マッチングしない </button>
		<button @click="$event => updateMatchStatus(registerID, 1)">マッチングする </button>
	</div>
</template>