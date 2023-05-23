<script setup lang="ts">
//refが被っているので､reactiveを使う
import { reactive } from "vue";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../server/firebase";
import { i } from "../log";

const props = defineProps<{
  image: string;
  file?: string;
}>();

let images: string[] = reactive([]);
const nasubiRef = ref(storage, (props.file === undefined ? "" : props.file + "/") + props.image + ".png");
console.log(i, nasubiRef.name);

getDownloadURL(nasubiRef).then((url) => {
  images.push(url);
  console.log(i, "newImageUrl: ", url);
});
</script>
<template>
  <div>
    <div v-if="images[0]">
      <img :src="images[0]" class="max-w-xl" />
    </div>
    <div v-else>
      <p>loading...</p>
    </div>
  </div>
</template>