<template>
	<div>
		{{ props.message }}
		<br />
		{{ props.content }}
	</div>
</template>
<script setup lang="ts">
const props=defineProps({
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