<script setup lang="ts">
import { onMounted, toRefs } from "vue";
import { e, s, i } from "@/log";
import { playerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";
import { startShop, watchTurnEnd } from "@/server/useShop";
import Status from "@/components/uiStatus.vue";
import Hand from "@/components/uiHand.vue";
import Mission from "@/components/uiMission.vue";
import Turn from "@/components/uiTurn.vue";
import Cards from "@/components/uiCards.vue";
import Shop from "@/components/shop.vue";

import allGifts from "@/assets/allGifts";
import allCharacters from "@/assets/allCharacters";
import allMissions from "@/assets/allMissions";

const { id, player, cardLock, phase, offer } = storeToRefs(playerStore);
const { idGame, character, gifts, status, hand, sign, donate } = toRefs(player.value);

const { game } = storeToRefs(gameStore);
const { players, missions, turn, firstAtkPlayer } = toRefs(game.value);

//入場したらPlayer型としてIDが保管される
onMounted(async () => {
  sign.value = id.value === players.value[0] ? 0 : 1;
  await startShop().then(() => {
    console.log(i, "gameId: ", idGame.value);
    console.log(i, "player1: ", players.value[0], "player2: ", players.value[1]);
    console.log(i, "your id: ", id.value, "your sign: ", sign.value);
    console.log(i, "character: ", allCharacters[character.value].name);
    console.log(i, "gift: ", allGifts[gifts.value[0]]?.name, allGifts[gifts.value[1]]?.name, allGifts[gifts.value[2]]?.name);
    console.log(i, "status: ", "hp: ", status.value.hp, "hungry: ", status.value.hungry, "contribution: ", status.value.contribution);
    console.log(i, "hand: ", hand.value.map((card) => card.name));
    console.log(i, "mission: ", allMissions[missions.value[0]]?.name, allMissions[missions.value[1]]?.name, allMissions[missions.value[2]]?.name);
    console.log(i, "turn: ", turn.value);
  });
});
//ターンを終了時
const turnEnd = async () => {
  if (cardLock.value) return;
  console.log(i, "turnEnd");
  //cardLockをtrueにする
  cardLock.value = true;
  //offerを空にする
  offer.value.splice(0, offer.value.length);
  await watchTurnEnd();
};

</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center h-screen">
      <h1>Battle</h1>
      {{ "Player: " + sign }}
      <div>
        <Turn />
      </div>
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
          <!-- <Cards /> -->
        </div>
        <div v-if="phase === 'shop' && turn !== 1">
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
