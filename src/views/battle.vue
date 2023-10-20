<script setup lang="ts">
import { onMounted, toRefs, watch, ref } from "vue";
import { playerStore, enemyPlayerStore, gameStore } from "@/main";
import { e, i } from "@/log";
import { usePush } from 'notivue'
import { useSound } from "@vueuse/sound";
import { storeToRefs } from "pinia";
import { intervalForEach, wait } from "@/server/utils";
import { getEnemyPlayer } from "@/server/usePlayerData";
import { drawOneCard } from "@/server/useShopUtils";
import { startShop } from "@/server/useShop";
//components
import UiEnemyInfo from "@/components/uiEnemyInfo.vue";
import UiGifts from "@/components/uiGifts.vue";
import UiMission from "@/components/uiMissions.vue";
import UiStatus from "@/components/uiStatus.vue";
import UiHand from "@/components/uiHand.vue";
import UiSumField from "@/components/uiSumField.vue";
import UiUseCard from "@/components/uiUseCard.vue";
import UiUseCardDisplay from "@/components/uiUseCardDisplay.vue";
import Shop from "@/components/shop.vue";
//asset
import allGifts from "@/assets/allGifts";
import allCharacters from "@/assets/allCharacters";
//img
import decideImg from "@/assets/img/ui/decide.png";
import battleImg from "@/assets/img/ui/battle.png"
import donateImg from "@/assets/img/ui/donate.png"
//sound
import { tap2, enemyTurn, myTurn, enemyCardIn, battlePhase, battleStart, shopping, cardSort, swipe, atk, def, tech } from "@/assets/sounds";

const { id, player, cardLock, phase, offer, sign, log, enemyLog, sumCards, components, battleResult } = storeToRefs(playerStore);
const { idGame, character, gifts, status, hand, donate, field, sumFields, name, check } = toRefs(player.value);
const { enemyPlayer } = storeToRefs(enemyPlayerStore);
const { hand: enemyHand } = toRefs(enemyPlayer.value)
const { game, missions } = storeToRefs(gameStore);
const { players, turn, firstAtkPlayer } = toRefs(game.value);

const push = usePush()
watch(log, (newVal) => {
  if (log.value === "") return
  push.info(log.value)
  log.value = ""
})
watch(enemyLog, (newVal) => {
  if (enemyLog.value === "") return
  push.error(enemyLog.value)
  enemyLog.value = ""
})

const useTap2 = useSound(tap2);
const useEnemyTurn = useSound(enemyTurn);
const useMyTurn = useSound(myTurn);
const useEnemyCardIn = useSound(enemyCardIn);
const useBattlePhase = useSound(battlePhase);
const useBattleStart = useSound(battleStart);
const useShopping = useSound(shopping);
const useCardSort = useSound(cardSort);
const useSwipe = useSound(swipe);
const useAtk = useSound(atk);
const useDef = useSound(def);
const useTech = useSound(tech);
//カード使用時に再生
watch(battleResult, (newVal) => {
  if (newVal[0] === "atk") {
    useAtk.play()
  }
  if (newVal[0] === "def") {
    useDef.play()
  }
  if (newVal[0] === "tech") {
    useTech.play()
  }
})
//missionが入れ替わったら再生
watch(missions, (newVal) => {
  if (!newVal) return;
  useBattleStart.play();
})
//手札が入れ替わったら再生
watch(hand, (newVal) => {
  if (!newVal) return;
  useCardSort.play();//!確定音で結構かき消されちゃう
})
watch(enemyHand, (newVal) => {
  if (!newVal) return;
  useEnemyCardIn.play()//?なんで反応しないのかUNKNOWN
})

//入場したらPlayer型としてIDが保管される
onMounted(async () => {
  sign.value = id.value === players.value[0] ? 0 : 1;
  setTimeout(async () => {
    useBattleStart.play()
    await getEnemyPlayer();//!あとでもっといい方法を考える
  }, 1500);
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
    useBattlePhase.play()
    setTimeout(async () => {
      battleAnimation.value = false;
    }, 1500);
  }
  if (newVal === 'shop') {
    useShopping.play()
  }
})
const myTurnAnimation = ref(false);
const enemyTurnAnimation = ref(false);
watch(components, (newVal) => {
  if (newVal === "primaryAtk") {
    if (sign.value === firstAtkPlayer.value) {
      myTurnAnimation.value = true;
      useMyTurn.play()
      setTimeout(async () => {
        myTurnAnimation.value = false;
      }, 2000);
    } else {
      enemyTurnAnimation.value = true;
      useEnemyTurn.play()
      setTimeout(async () => {
        enemyTurnAnimation.value = false;
      }, 2000);
    }
  }
  if (newVal === "secondAtk") {
    if (sign.value !== firstAtkPlayer.value) {
      myTurnAnimation.value = true;
      useMyTurn.play()
      setTimeout(async () => {
        myTurnAnimation.value = false;
      }, 2000);
    } else {
      enemyTurnAnimation.value = true;
      useEnemyTurn.play()
      setTimeout(async () => {
        enemyTurnAnimation.value = false;
      }, 2000);
    }
  }
})
const wantCard = ref()//!test用
</script>

<template>
  <div>
    <div class="flex flex-col h-screen w-screen p-5 relative">
      <div class="flex flex-row-reverse">
        <UiEnemyInfo :p="enemyPlayer" :sign="sign" />
        <div class="flex flex-col">
          <p> {{ "id: " + id }}</p>
          <p> {{ "sign: " + sign + " phase: " + phase + " turn: " + turn }}</p>
          <button @click="drawOneCard(wantCard)">drawSelectCard</button>
          <input v-model="wantCard" type="number" />
          <button @click="enemyLog = 'test'">test</button>
        </div>
      </div>

      <transition-group enter-from-class="translate-y-[-150%] opacity-0" leave-to-class="translate-y-[150%] opacity-0"
        leave-active-class="transition duration-300" enter-active-class="transition duration-300">
        <div v-if="phase === 'battle' && !cardLock" class="flex justify-center mt-5">
          <button @click="turnEnd(); useTap2.play()">
            <img :src="decideImg" style="width: 20vw;" />
          </button>
          <UiSumField />
          <button @click="donate = !donate; useSwipe.play()" class="card-pop">
            <div class="overCard">
              <div class="p-8 bg-white  border-gray-700 rounded-full border-2" />
              <div class="w-12 overText">
                <img v-if="donate" :src="donateImg" />
                <img v-else :src="battleImg" />
              </div>
            </div>
          </button>
        </div>
      </transition-group>

      <div v-if="components !== 'postBattle'">
        {{ components }}
        <div style="width: 40vw;">
          <UiUseCard :player="sign === firstAtkPlayer ? player : enemyPlayer" :which="'primary'"
            v-show="components !== 'secondAtk'" />
          <UiUseCard :player="sign === firstAtkPlayer ? enemyPlayer : player" :which="'second'" />
        </div>

        <div class="overlay">
          <transition appear enter-from-class="translate-y-[-150%] opacity-0"
            leave-to-class="translate-y-[150%] opacity-0" leave-active-class="transition duration-300"
            enter-active-class="transition duration-300" mode="out-in">
            <img v-if="myTurnAnimation" :src="`/gifs/myTurn.png`" style="width: 40vw;" />
            <img v-else-if="enemyTurnAnimation" :src="`/gifs/enemyTurn.png`" style="width: 40vw;" />
            <div v-else class="flex flex-col">
              <UiUseCardDisplay v-if="sign === firstAtkPlayer" :after="battleResult[0]" :value="battleResult[1]"
                :cards="components === 'primaryAtk' ? field : enemyPlayer.field" />
              <UiUseCardDisplay v-if="sign !== firstAtkPlayer" :after="battleResult[0]" :value="battleResult[1]"
                :cards="components === 'primaryAtk' ? enemyPlayer.field : field" />
            </div>
          </transition>
        </div>
      </div>

      <div v-if="phase === 'shop' && turn !== 1" class="overlay">
        <Shop />
      </div>
      <div v-else-if="battleAnimation" class="overlay">
        <img :src="`/gifs/eating.gif`" />
      </div>

      <img v-if="(cardLock && phase === 'battle' && components === 'postBattle') || (phase === 'shop' && check)"
        :src="`/gifs/waiting.gif`" class="bottom-0 fixed mb-36" style="width: 40vw;" />
      <div class="bottom-0 fixed m-3">
        <div class="flex justify-start" style="width: 95vw;">
          <UiStatus :player="player" />
          <UiGifts :gifts="gifts" player="player" />
          <UiMission class="ml-auto" />
        </div>
        <div v-if="hand.length === 0" class="pt-5 cardSize">
          <img :src="`/img/companys/bianca.png`" /><!--!ダミーカード-->
        </div>
        <UiHand v-else class=" pt-5 " />
      </div>
    </div>
  </div>
</template>
