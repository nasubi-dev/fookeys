<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import Text from '../components/Text.vue';
const message:Ref<string> = ref('');
</script>
<template>
	<h1>Home</h1>
	<input type="text" v-model="message"
		class=" hover:bg-gray-100 active:bg-gray-200 border border-gray-300 font-semibold text-center rounded-lg" />
	<Text :msg="message" />
</template>