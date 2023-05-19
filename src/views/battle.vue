<script setup lang="ts">
import { onMounted } from "vue";
import { startGame, setHand, setMissions, watchTurnEnd } from "@/server/useBattle";
import { playerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";
import { e, s, i } from "@/log";
import Status from "@/components/status.vue";
import Cards from "@/components/cards.vue";
import Mission from "@/components/mission.vue";

const { turn, players, missions } = storeToRefs(gameStore);
const { id, sign, hand, field, character, gift, status, idGame } = storeToRefs(playerStore);
const { ClickHand,ClickField,DeleteField } = playerStore;
//入場したらPlayer型としてIDが保管される
onMounted(async () => {
  await startGame();
  sign.value = id.value === players.value[0] ? 0 : 1;
  await setHand();
  await setMissions();
  //log
  console.log(i, "gameId: ", idGame.value);
  console.log(i, "player1: ", players.value[0], "player2: ", players.value[1]);
  console.log(i, "your id: ", id.value, "your sign: ", sign.value);
  console.log(i, "character: ", character.value);
  console.log(i, "gift: ", gift.value[0], gift.value[1], gift.value[2]);
  console.log(i, "status: ", "hp: ", status.value.hp, "hungry: ", status.value.hungry, "contribution: ", status.value.contribution, "priority: ", status.value.priority);
  console.log(i, "hand: ", hand.value);
  console.log(i, "mission: ", missions.value[0], missions.value[1], missions.value[2]);
  console.log(i, "turn: ", turn.value);
});
//ターンを終了時
const turnEnd = async () => {
  console.log(i,"turnEnd");
  Promise.all([
    await watchTurnEnd(),
  ]).then(() => {
    //処理が終了したらFieldを削除
    DeleteField();
    //handのカードのwasteの値を-1する
    //腐っていれば腐ったカードに入れ替える
    //ターンを進める
  });
};

</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center h-screen">
      <h1>Battle</h1>
      <p class="text-sm font-medium text-gray-900 truncate">turn:{{ turn }}</p>
      {{ "Player: " + (playerStore.sign + 1) }}
      <div class="max-w-7xl mx-auto">
        <div>
          <h1>Mission</h1>
          <Mission :missions="missions" />
        </div>
        <div>
          <h1>Status</h1>
          <Status :id="sign" />
        </div>
        <div>
          <h1>Field</h1>
          <Cards :cards="field" @sendText="ClickField" />
        </div>
        <div class="flex flex-col justify-end">
          <button @click="turnEnd">ターン終了ボタン</button>
        </div>
        <div>
          <h1>Hand</h1>
          <Cards :cards="hand" @sendText="ClickHand" />
        </div>
      </div>
    </div>
  </div>
</template>
