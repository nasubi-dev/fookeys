<script setup lang="ts">
import { onMounted } from "vue";
import { useBattle, setHand, setMissions } from "@/server/useBattle";
import { playerStore, gameStore } from "@/main";
import Status from "@/components/status.vue";
import Cards from "@/components/cards.vue";
import Mission from "@/components/mission.vue";

//入場したらPlayer型としてIDが保管される
onMounted(async () => {
  await useBattle();
  playerStore.id == gameStore.players[0] ? playerStore.sign = 0 : playerStore.sign = 1;
  console.log("gameStore: ", gameStore.players, gameStore.turn, gameStore.missions);
});

//この関数は最終的にonMountedに統合する
async function gameStart() {
  await setHand();
  console.log("hand: ", playerStore.hand);
  await setMissions();
  console.log("missions: ", gameStore.missions);
}

//Handのカードをクリックしたら、そのカードをFieldに出す
const handClick = (index: number) => {
  console.log("handClick: ", index);
  playerStore.board.push(playerStore.hand[index]);
  playerStore.hand.splice(index, 1);
  console.log("board: ", playerStore.board);
};
//Fieldのカードをクリックしたら、そのカードをHandに戻す
const boardClick = (index: number) => {
  console.log("boardClick: ", index);
  playerStore.hand.push(playerStore.board[index]);
  playerStore.board.splice(index, 1);
  console.log("hand: ", playerStore.hand);
};

</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center h-screen">
      <h1>Battle</h1>
      <p class="text-sm font-medium text-gray-900 truncate">turn:{{ gameStore.turn }}</p>
      {{ "Player" + (playerStore.sign + 1) }}
      <button @click="gameStart">gameStart</button>
      <div class="max-w-7xl mx-auto">
        <div>
          <h1>Mission</h1>
          <Mission :missions="gameStore.missions" />
        </div>
        <div>
          <h1>Status</h1>
          <Status :id="playerStore.sign" />
        </div>
        <div>
          <h1>Field</h1>
          <Cards :cards="playerStore.board" @sendText="boardClick" />
        </div>
        <div>
          <h1>Hand</h1>
          <Cards :cards="playerStore.hand" @sendText="handClick" />
        </div>
      </div>
    </div>
  </div>
</template>
