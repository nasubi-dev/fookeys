<script setup lang="ts">
import { ref, toRefs } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { registerPlayer } from "@/server/usePlayerID";

//storeの参照
const { id, player } = storeToRefs(playerStore);
const { name } = toRefs(player.value);

const newName = ref("");
//アプリが起動したらユーザーIDを取得する ユーザー名が空の場合はNo name
async function register() {
  newName.value === "" ? (name.value = "No name") : (name.value = newName.value);
  id.value == "" ? await registerPlayer() : console.log("既に登録されています");
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <img src="@/assets/fookeys.png" class="w-60" />
    <form class="flex flex-col items-center">
      <input class="border border-gray-400 rounded-lg p-2 w-64" type="text" placeholder="please name" v-model="newName" />
      <router-link to="/menu" @click="register" type="button"
        class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2 btn-pop">
        <button>Menu</button>
      </router-link>
    </form>
  </div>
</template>
