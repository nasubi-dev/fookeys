<script setup lang="ts">
import { onMounted, toRefs, watch } from "vue";
import { e, s, i } from "@/log";
import { playerStore, enemyPlayerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";
import { getEnemyPlayer } from "@/server/usePlayerData";
import { startShop } from "@/server/useShop";
import Status from "@/components/uiStatus.vue";
import UiHand from "@/components/uiHand.vue";
import UiEnemyHand from "@/components/uiEnemyHand.vue";
import Mission from "@/components/uiMission.vue";
import Shop from "@/components/shop.vue";
import allGifts from "@/assets/allGifts";
import allCharacters from "@/assets/allCharacters";

import { usePush } from 'notivue'
const push = usePush()


const { id, player, cardLock, phase, offer, sign, log } = storeToRefs(playerStore);
const { idGame, character, gifts, status, hand, donate } = toRefs(player.value);

const { enemyPlayer } = storeToRefs(enemyPlayerStore);

const { game, missions } = storeToRefs(gameStore);
const { players, turn, firstAtkPlayer } = toRefs(game.value);

watch(log, (newVal) => {
  if (newVal) push.info(newVal)
})

//入場したらPlayer型としてIDが保管される
onMounted(async () => {
  sign.value = id.value === players.value[0] ? 0 : 1;
  status.value.contribution += allCharacters[character.value].initialContribution ?? 0;
  if (allCharacters[character.value].maxHp !== undefined) {
    status.value.hp += allCharacters[character.value].maxHp ?? 600;
  }
  getEnemyPlayer();
  await startShop().then(() => {
    console.log(i, "gameId: ", idGame.value);
    console.log(i, "player1: ", players.value[0], "player2: ", players.value[1]);
    console.log(i, "your id: ", id.value, "your sign: ", sign.value);
    console.log(i, "character: ", allCharacters[character.value].name);
    console.log(i, "gift: ", allGifts[gifts.value[0]]?.name, allGifts[gifts.value[1]]?.name, allGifts[gifts.value[2]]?.name);
    console.log(i, "status: ", "hp: ", status.value.hp, "hungry: ", status.value.hungry, "contribution: ", status.value.contribution);
    console.log(i, "hand: ", hand.value.map((card) => card.name));
    console.log(i, "mission: ", missions.value[0]?.name, missions.value[1]?.name, missions.value[2]?.name);
    console.log(i, "turn: ", turn.value);
  });
});
//ターンを終了時
const turnEnd = async () => {
  if (cardLock.value) return;
  console.log(i, "turnEnd");
  //cardLockをtrueにする
  cardLock.value = true;
  //!手札がFirestoreに保存するためにhand.vueから移動する
};

</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center h-screen">
      <h1>Battle</h1>
      {{ "Player: " + sign }}
      {{ "Phase: " + phase }}
      <div class="max-w-7xl mx-auto">
        <div>
          <h1>enemyHand</h1>
          <UiEnemyHand :cards="enemyPlayer.hand" />
        </div>
        <div>
          <Status :player="enemyPlayer" />
        </div>
        <div>
          <h1>Mission</h1>
          <Mission />
        </div>
        <div>
          <h1>Status</h1>
          <Status :player="player" />
        </div>
        <div v-if="phase === 'shop' && turn !== 1" class="overlay">
          <h1>shop</h1>
          <Shop />
        </div>
        <div :class="cardLock ? 'bg-red-100' : 'bg-blue-100'" class="flex flex-col justify-end">
          <button @click="turnEnd()">ターン終了ボタン</button>
        </div>
        <div>
          <h1>Hand</h1>
          <button @click="cardLock ? null : donate = !donate" :class="donate ? 'bg-red-100' : 'bg-blue-100'">
            <div v-if="donate">寄付MODE</div>
            <div v-else>戦闘MODE</div>
          </button>
          <UiHand />
        </div>
      </div>
      <!-- <div v-if="firstAtkPlayer === undefined">
        <p>準備中</p>
      </div>
      <div v-else-if="firstAtkPlayer === sign">
        <p>先攻</p>
      </div>
      <div v-else>
        <p>後攻</p>
      </div> -->
    </div>
  </div>
</template>
