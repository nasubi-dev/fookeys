<script setup lang="ts">
import { onMounted, toRefs } from "vue";
import { e, s, i } from "@/log";
import { playerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";
import { setHand, setMissions, watchTurnEnd } from "@/server/useShop";
import { startGame } from "@/server/useBattle";
import Status from "@/components/status.vue";
import Hand from "@/components/hand.vue";
import Mission from "@/components/mission.vue";

const { id, player, cardLock } = storeToRefs(playerStore);
const { idGame, character, gift, status, hand, sign } = toRefs(player.value);

const { game } = storeToRefs(gameStore);
const { players, missions, turn, firstAtkPlayer } = toRefs(game.value);

//入場したらPlayer型としてIDが保管される
onMounted(async () => {
  await startGame();
  sign.value = id.value === players.value[0] ? 0 : 1;
  await Promise.all([
    setHand(),
    setMissions(),
  ]).then(() => {
    console.log(i, "gameId: ", idGame.value);
    console.log(i, "player1: ", players.value[0], "player2: ", players.value[1]);
    console.log(i, "your id: ", id.value, "your sign: ", sign.value);
    console.log(i, "character: ", character.value?.name);
    console.log(i, "gift: ", gift.value[0]?.name, gift.value[1]?.name, gift.value[2]?.name);
    console.log(i, "status: ", "hp: ", status.value.hp, "hungry: ", status.value.hungry, "contribution: ", status.value.contribution);
    console.log(i, "hand: ", hand.value.map((card) => card.name));
    console.log(i, "mission: ", missions.value.map((mission) => mission.name));
    console.log(i, "turn: ", turn.value);
  });
});
//ターンを終了時
const turnEnd = async () => {
  //
  if (cardLock.value) return;
  console.log(i, "turnEnd");
  //cardLockをtrueにする
  cardLock.value = true;
  await watchTurnEnd();
};

</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center h-screen">
      <h1>Battle</h1>
      <p class="text-sm font-medium text-gray-900 truncate">turn:{{ turn }}</p>
      {{ "Player: " + (sign + 1) }}
      <div class="max-w-7xl mx-auto">
        <div>
          <h1>Mission</h1>
          <Mission />
        </div>
        <div>
          <h1>Status</h1>
          <Status />
        </div>
        <div>
          <h1>Field</h1>
        </div>
        <div :class="cardLock ? 'bg-red-100' : 'bg-blue-100'" class="flex flex-col justify-end">
          <button @click="turnEnd()">ターン終了ボタン</button>
        </div>
        <div>
          <h1>Hand</h1>
          <Hand />
        </div>
      </div>
      <div v-if="firstAtkPlayer === sign">
        <p>先攻</p>
      </div>
      <div v-else>
        <p>後攻</p>
      </div>
    </div>
  </div>
</template>
