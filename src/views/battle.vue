<script setup lang="ts">
import PlayerData from "@/components/playerData.vue";
import { getPlayerData } from "@/server/useMatchMaking";
import { useBattle } from "@/server/useBattle";
import { usePlayerStore, useGameStore } from "@/store";

const playerStore = usePlayerStore();
const gameStore = useGameStore();

//入場したらPlayer型としてIDが保管される
//Mountedに将来的に変える
async function battle() {
  const playerData = (await getPlayerData(playerStore.id)).data;
  if (playerData) {
    playerStore.idGame = playerData.idGame;
    playerStore.name = playerData.name;
    const gameData = await useBattle(playerStore.idGame);
    gameStore.turn = gameData.turn; //まとめ方がわからない
    gameStore.players = gameData.players;
    console.log("test", gameData);
  }
}
//表示するデータをplayer1,2で分ける
//onSnapshotの中でGameのplayer1,2の順番を入れ替える?
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1>Battle</h1>
    <button @click="battle()">Battle</button>
    <div class="flex justify-end">
      <ul class="divide-x divide-gray-200">
        <li class="py-4">
          <p class="text-sm font-medium text-gray-900 truncate">turn:{{ gameStore.turn }}</p>
        </li>
        <li class="py-4">
          <p class="text-sm font-medium text-gray-900 truncate">name:{{ gameStore.players[0].name }}</p>
        </li>
        <li class="py-4">
          <p class="text-sm font-medium text-gray-900 truncate">HP❤:{{ gameStore.players[0].status.hp }}</p>
        </li>
        <li class="py-4">
          <p class="text-sm font-medium text-gray-900 truncate">hungry🍖:{{ gameStore.players[0].status.hungry }}</p>
        </li>
        <li class="py-4">
          <p class="text-sm font-medium text-gray-900 truncate">
            contribution🪙:{{ gameStore.players[0].status.contribution }}
          </p>
        </li>
        <li class="py-4">
          <p class="text-sm font-medium text-gray-900 truncate">
            priority🦶:{{ gameStore.players[0].status.priority }}
          </p>
        </li>
      </ul>
    </div>

    <PlayerData />
  </div>
</template>
