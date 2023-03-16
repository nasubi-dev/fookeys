<template>
	<div>
		{{ props.msg }}
		<br />
		{{ props.content }}
	</div>
</template>
<script setup lang="ts">
const props=defineProps({
	msg: {
		type: String,
		required: true
	},
	content: {
      type: Array,
      default: () => ['a', 'b', 'c'],
			
	}
});
</script>