<template>
	<div>
		{{ message }}
		<br />
		{{ content }}
	</div>
</template>
<script setup lang="ts">
defineProps({
	message: {
		type: String,
		required: true
	},
	content: {
      type: Array,
      default: () => [],
			
	}
});
</script>