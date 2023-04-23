<script setup lang="ts">
import { updatePlayerName } from "@/server/usePlayerID";
import { usePlayerStore } from "@/store";

const playerStore = usePlayerStore();

//ユーザー名を変更する ユーザー名が空の場合はNo name
async function updateName() {
  if (playerStore.name === "") {
    playerStore.name = await updatePlayerName(playerStore.id, "No name");
  } else {
    playerStore.name = await updatePlayerName(playerStore.id, playerStore.name);
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold mb-4">Home</h1>

    <div class="mt-4">
      <span class="text-xl font-bold">Your ID:{{ playerStore.id }}</span>
    </div>

    <form class="flex flex-col items-center">
      <input
        class="border border-gray-400 rounded-lg p-2 w-64"
        type="text"
        placeholder="please name"
        v-model="playerStore.name"
      />
      <router-link
        to="/menu"
        @click="updateName"
        type="button"
        class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2 btn-pop"
      >
        <button>Menu</button>
      </router-link>
    </form>
  </div>
</template>
