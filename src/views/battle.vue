<script setup lang="ts">
import { onMounted, toRefs, watch, ref } from "vue";
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
import UiUseCard from "@/components/uiUseCard.vue";
import UiUseCardDisplay from "@/components/uiUseCardDisplay.vue";
import Shop from "@/components/shop.vue";
import allGifts from "@/assets/allGifts";
import allCharacters from "@/assets/allCharacters";
import decide from "@/assets/img/ui/decide.png";

import { usePush } from 'notivue'
const push = usePush()

const { id, player, cardLock, phase, offer, sign, log, sumCards, components, battleResult } = storeToRefs(playerStore);
const { idGame, character, gifts, status, hand, donate, field, sumFields, name } = toRefs(player.value);
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
    console.log(i, "mission: ", missions.value?.map((mission) => mission.name));
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

const battleAnimation = ref(true);
watch(phase, (newVal) => {
  if (newVal === 'battle') {
    battleAnimation.value = true;
    setTimeout(async () => {
      battleAnimation.value = false;
    }, 1500);
  }
})

</script>

<template>
  <div>
    <div class="flex flex-col h-screen w-screen p-5 relative">
      <div class="flex flex-row-reverse">
        <UiEnemyInfo :p="enemyPlayer" />
        <div class="flex flex-col">
          <p> {{ "id: " + id }}</p>
          <p> {{ "sign: " + sign }}</p>
          <p> {{ "phase: " + phase }}</p>
          <p> {{ "turn: " + turn }}</p>
        </div>
      </div>

      <transition-group enter-from-class="translate-y-[-150%] opacity-0" leave-to-class="translate-y-[150%] opacity-0"
        leave-active-class="transition duration-300" enter-active-class="transition duration-300">
        <div v-if="phase === 'battle' && !cardLock" class="flex justify-center mt-5">
          <button @click="turnEnd()">
            <img :src="decide" style="width: 20vw;" />
          </button>
          <UiSumField />
          <button @click="cardLock ? null : donate = !donate" class="card-pop"
            :class="donate ? 'bg-red-100' : 'bg-blue-100'">
            <div v-if="donate">寄付MODE</div>
            <div v-else>戦闘MODE</div>
          </button>
        </div>
      </transition-group>

      <div v-if="components !== 'afterBattle'">
        {{ components }}
        <div v-if="sign === firstAtkPlayer" style="width: 40vw;">
          <UiUseCard :player="player" :which="'primary'" v-show="components !== 'secondAtk'" />
          <UiUseCard :player="enemyPlayer" :which="'second'" />
        </div>
        <div v-else style="width: 40vw;">
          <UiUseCard :player="enemyPlayer" :which="'primary'" v-show="components !== 'secondAtk'" />
          <UiUseCard :player="player" :which="'second'" />
        </div>

        <div class="overlay flex flex-col">
          <UiUseCardDisplay v-if="sign === firstAtkPlayer" :after="battleResult[0]" :value="battleResult[1]"
            :cards="components === 'primaryAtk' ? field : enemyPlayer.field" />
          <UiUseCardDisplay v-if="sign !== firstAtkPlayer" :after="battleResult[0]" :value="battleResult[1]"
            :cards="components === 'primaryAtk' ? enemyPlayer.field : field" />
        </div>
      </div>

      <div v-if="phase === 'shop' && turn !== 1" class="overlay gray">
        <Shop />
      </div>
      <div v-else>
        <div v-if="battleAnimation" class="overlay">
          <img :src="`/gifs/eating.gif`" />
        </div>
      </div>

      <div class="bottom-0 absolute m-3">
        <div class="flex justify-start mb-1" style="width: 95vw;">
          <UiStatus :player="player" />
          <UiGifts :gifts="gifts" player="player" />
          <UiMission class="ml-auto" />
        </div>
        <UiHand class=" pt-5" />
      </div>
    </div>
  </div>
</template>
