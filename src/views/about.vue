<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import db from '../main';

const getCollection = async () => {
  const docRef = doc(db, "test", "12345");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
}

const data = ref(<null | DocumentData>null);

onMounted(async () => {
  data.value = await getCollection();
});
</script>

<template>
  <h1>about</h1>
  <button class="bg-green-500 font-semibold text-white py-2 px-4 rounded">Button</button>
  <div>{{ data }}</div>
</template>