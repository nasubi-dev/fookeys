<script setup lang="ts">
import { onMounted, toRefs, watch } from "vue";
import { e, s, i } from "@/log";
import { playerStore, enemyPlayerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";
import { getEnemyPlayer } from "@/server/usePlayerData";
import { startShop } from "@/server/useShop";
import UiEnemyInfo from "@/components/uiEnemyInfo.vue";
import UiGifts from "@/components/uiGifts.vue";
import UiMission from "@/components/uiMissions.vue";
import UiStatus from "@/components/uiStatus.vue";
import UiHand from "@/components/uiHand.vue";
import UiSumField from "@/components/uiSumField.vue";
import UiEnemyUseCard from "@/components/uiEnemyUseCard.vue";
import UiUseCard from "@/components/uiUseCard.vue";
import Shop from "@/components/shop.vue";
import allGifts from "@/assets/allGifts";
import allCharacters from "@/assets/allCharacters";
import infoImg from "@/assets/img/ui/info.png";
import decide from "@/assets/img/ui/decide.png";

import { usePush } from 'notivue'
const push = usePush()

const { id, player, cardLock, phase, offer, sign, log, sumCards, components } = storeToRefs(playerStore);
const { idGame, character, gifts, status, hand, donate, field, sumFields } = toRefs(player.value);
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
  setTimeout(async () => {
    await getEnemyPlayer();//!あとでもっといい方法を考える
  }, 1000);

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
const turnEnd = () => {
  if (cardLock.value) return;
  console.log(i, "turnEnd");
  //cardLockをtrueにする
  cardLock.value = true;
  //!手札がFirestoreに保存するためにhand.vueから移動する
};

</script>

<template>
  <div>
    <div class="flex flex-col h-screen w-screen p-5 relative">

      <UiEnemyInfo :e="enemyPlayer" class="flex flex-row-reverse" />

      <div v-if="components === 'afterBattle'" class="flex justify-center">
        <button @click="turnEnd()" :class="cardLock ? 'bg-red-100' : 'bg-blue-100'" class="rounded-full">
          <img :src="decide" style="width: 20vw;" />
        </button>
        <UiSumField />
        <button @click="cardLock ? null : donate = !donate" :class="donate ? 'bg-red-100' : 'bg-blue-100'">
          <div v-if="donate">寄付MODE</div>
          <div v-else>戦闘MODE</div>
        </button>
      </div>

      <div v-else>
        "先行の使用したカード"
        "後攻の使用したカード"
        "優先度高い順にカードを処理"
        {{ components }}
        <div v-if="sign === firstAtkPlayer" style="width: 35vw;">
          <div v-if="components !== 'afterSecondAtk'">
            <UiUseCard />
          </div>
          <UiEnemyUseCard />
        </div>
        <div v-else style="width: 35vw;">
          <div v-if="components !== 'afterSecondAtk'">
            <UiEnemyUseCard />
          </div>
          <UiUseCard />
        </div>
        <div class="overlay">
          test:
          <div v-if="components === 'afterMuscle'">
            afterMuscle
            {{ field.map((card) => {
              if (card.id <= 22 && card.id > 0) { return card.name }
            }) }}
          </div>
          <div v-if="components === 'afterTechnique'">
            afterTechnique
            {{ field.map((card) => {
              if (card.id <= 44 && card.id > 22) { return card.name }
            }) }}
          </div>
          <div v-if="components === 'afterDefense'">
            afterDefense
            {{ field.map((card) => {
              if (card.id <= 65 && card.id > 44) { return card.name }
            }) }}
          </div>
          <div v-if="components === 'afterSupport'">
            afterSupport
            {{ field.map((card) => {
              if (card.id <= 96 && card.id > 65) { return card.name }
            }) }}
          </div>
        </div>
      </div>

      <div v-if="phase === 'shop' && turn !== 1" class="overlay gray">
        <Shop />
      </div>

      <div class="bottom-0 absolute mb-3 mr-3 max-w-full">
        <div class="flex max-w-full mb-1">
          <UiStatus :player="player" />
          <UiGifts :gifts="gifts" player="player" />
          <UiMission class="ml-auto" />
        </div>
        <UiHand />
      </div>
    </div>
  </div>
</template>
