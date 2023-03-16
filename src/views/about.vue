<script setup lang="ts">
import {ref} from "vue";
import {doc,getDoc} from "firebase/firestore";
import {db} from "../firebase";

const docRef = doc(db, 'test', '12345')
const data = ref()

getDoc(docRef).then((doc): void => {
  if (doc.exists()) {
    data.value = doc.data()
  } else {
    console.log('No such document!')
  }
})
</script>

<template>
	<h1>about</h1>
	<button class="bg-green-500 font-semibold text-white py-2 px-4 rounded">Button</button>
{{ data }}
</template>