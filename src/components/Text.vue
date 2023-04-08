<template>
	<div>
		{{ props.msg }}
	</div>
</template>
<script setup lang="ts">
const props=defineProps({
	msg: {
		type: String,
		required: true
	}
});
</script>