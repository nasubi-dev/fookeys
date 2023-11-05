<script setup lang="ts">
import { onMounted, toRefs, watch, ref, markRaw } from "vue";
import { Notivue, Notifications, filledIcons } from 'notivue'
import { usePush } from 'notivue'
import { useSound } from "@vueuse/sound";
import { playerStore, enemyPlayerStore, gameStore } from "@/main";
import { storeToRefs } from "pinia";
import { e, s, i } from "@/log";
import { intervalForEach, wait, XOR } from "@/server/utils";
import { getEnemyPlayer, initPlayer } from "@/server/usePlayerData";
import { deleteGame } from "@/server/useMatchMaking";
import { drawRandomOneCard } from "@/server/useShopUtils";
import { startShop } from "@/server/useShop";
//components
import UiEnemyInfo from "@/components/uiEnemyInfo.vue";
import UiGifts from "@/components/uiGifts.vue";
import UiMission from "@/components/uiMissions.vue";
import UiStatus from "@/components/uiStatus.vue";
import UiHand from "@/components/uiHand.vue";
import UiUseCard from "@/components/uiUseCard.vue";
import UiUseCardDisplay from "@/components/uiUseCardDisplay.vue";
import Shop from "@/components/shop.vue";
import Battle from "@/components/battle.vue";
import myLogImg from "@/components/myLog.vue";
import enemyLogImg from "@/components/enemyLog.vue";
//img
import backImg from "@/assets/img/ui/back.png";
import winImg from "@/assets/img/ui/win.png";
import loseImg from "@/assets/img/ui/lose.png";
//asset
import allGifts from "@/assets/allGifts";
//sound
import { tap2, enemyTurn, myTurn, battlePhase, battleStart, shopping, missionSort, donate, atk, def, tech, hp, sup, rotten } from "@/assets/sounds";
import bgm from "@/assets/sounds/bgm.mp3";
const useBGM = useSound(bgm, { volume: 0.1, loop: true });
const useTap2 = useSound(tap2);
const useEnemyTurn = useSound(enemyTurn);
const useMyTurn = useSound(myTurn);
const useBattlePhase = useSound(battlePhase);
const useBattleStart = useSound(battleStart);
const useMissionSort = useSound(missionSort);
const useShopping = useSound(shopping);
const useRotten = useSound(rotten);
const useDonate = useSound(donate);
const useHp = useSound(hp);
const useSup = useSound(sup);
const useDef = useSound(def);
const useAtk = useSound(atk);
const useTech = useSound(tech);

const { id, player, cardLock, phase, offer, sign, log, myLog, enemyLog, sumCards, components, battleResult } = storeToRefs(playerStore);
const { idGame, match, character, gifts, status, hand, death, field, sumFields, name, check } = toRefs(player.value);
const { enemyPlayer } = storeToRefs(enemyPlayerStore);
const { game, missions } = storeToRefs(gameStore);
const { players, turn, firstAtkPlayer } = toRefs(game.value);

//log
const customIcons = {
  success: myLogImg,
  error: enemyLogImg,
  info: filledIcons.info,
  close: filledIcons.close,
  promise: filledIcons.promise
}
const push = usePush()
watch(log, () => {
  if (log.value === "") return
  push.info(log.value)
  if (log.value.includes("枚のカードが腐ってしまった！")) {
    useRotten.play()
  }
  log.value = ""
})
watch(myLog, () => {
  if (myLog.value === "") return
  push.success(myLog.value)
  myLog.value = ""
})
watch(enemyLog, () => {
  if (enemyLog.value === "") return
  push.error(enemyLog.value)
  enemyLog.value = ""
})

//BGMの再生
const isBGM = ref(false)
watch(isBGM, (newVal) => {
  if (newVal) useBGM.play()
  else useBGM.pause()
})
//カード使用時に再生
watch(battleResult, (newVal) => {
  if (newVal[0] === "donate") useDonate.play()
  if (newVal[0] === "heal") useHp.play()
  if (newVal[0] === "sup") useSup.play()
  if (newVal[0] === "def") useDef.play()
  if (newVal[0] === "atk") useAtk.play()
  if (newVal[0] === "tech") useTech.play()
})
//missionが入れ替わったら再生
watch(missions, (newVal) => {
  if (newVal) useMissionSort.play();
})
//Phaseが変わったら再生
watch(phase, (newVal) => {
  if (newVal === 'battle') useBattlePhase.play()
  if (newVal === 'shop') {
    useShopping.play()
    setTimeout(async () => {
      await getEnemyPlayer();
    }, 2000);
  }
})

//入場したらPlayer型としてIDが保管される
const startAnimation = ref(false);
onMounted(async () => {
  sign.value = id.value === players.value[0] ? 0 : 1;
  startAnimation.value = true;
  setTimeout(async () => {
    startAnimation.value = false;
    character.value = sign.value === 0 ? "blankiss" : "petit&spot";
    enemyPlayer.value.character = sign.value !== 0 ? "blankiss" : "petit&spot"
    useBattleStart.play()
    await getEnemyPlayer();
  }, 1700);
  await startShop().then(() => {
    console.log(i, "gameId: ", idGame.value);
    console.log(i, "player1: ", players.value[0], "player2: ", players.value[1]);
    console.log(i, "your id: ", id.value, "your sign: ", sign.value);
    console.log(i, "character: ", character.value);
    console.log(i, "gift: ", allGifts[gifts.value[0]]?.name, allGifts[gifts.value[1]]?.name, allGifts[gifts.value[2]]?.name);
    console.log(i, "status: ", "hp: ", status.value.hp, "hungry: ", status.value.hungry, "contribution: ", status.value.contribution);
    console.log(i, "hand: ", hand.value.map((card) => card.name));
    console.log(i, "mission: ", missions.value?.map((mission) => mission.name));
    console.log(i, "turn: ", turn.value);
  });
});


const myTurnAnimation = ref(false);
const enemyTurnAnimation = ref(false);
watch(components, (newVal) => {
  if (newVal === "primaryAtk") {
    if (sign.value === firstAtkPlayer.value) {
      myTurnAnimation.value = true;
      useMyTurn.play()
      setTimeout(async () => {
        myTurnAnimation.value = false;
      }, 1000);
    } else {
      enemyTurnAnimation.value = true;
      useEnemyTurn.play()
      setTimeout(async () => {
        enemyTurnAnimation.value = false;
      }, 1000);
    }
  }
  if (newVal === "secondAtk") {
    if (sign.value !== firstAtkPlayer.value) {
      myTurnAnimation.value = true;
      useMyTurn.play()
      setTimeout(async () => {
        myTurnAnimation.value = false;
      }, 1000);
    } else {
      enemyTurnAnimation.value = true;
      useEnemyTurn.play()
      setTimeout(async () => {
        enemyTurnAnimation.value = false;
      }, 1000);
    }
  }
})
const deathAnimation = ref(false);
watch(death, (newVal) => {
  if (newVal) {
    deathAnimation.value = true;
    setTimeout(async () => {
      deathAnimation.value = false;
    }, 1200);
  }
})
const wantCard = ref()//!test用
</script>

<template>
  <div>
    <Notivue v-slot="item">
      <Notifications :item="item" :icons="customIcons" />
    </Notivue>
    <div class="flex flex-col h-screen w-screen p-5 relative">
      <img  v-if="startAnimation" :src="`/gifs/start.gif`"  class="flex flex-col overlay z-10" />
      <div v-if="death" class="flex flex-col overlay z-10">
        <div v-if="status.hp <= 0"><img :src="deathAnimation ? `/gifs/lose.gif` : loseImg" /></div>
        <div v-else><img :src="deathAnimation ? `/gifs/win.gif` : winImg" /></div>
        <RouterLink to="/">
          <button @click="deleteGame(); initPlayer(); useTap2.play()" class="btn-pop transform -translate-y-24">
            <img :src="backImg" class="w-32" />
          </button>
        </RouterLink>
      </div>


      <div class="flex flex-row-reverse z-20 fixed w-full">
        <UiEnemyInfo :player="enemyPlayer" :sign="sign" class="mr-12" />
        <div class="flex flex-col">
          <p> {{ "id: " + id }}</p>
          <p> {{ "sign: " + sign + " phase: " + phase + " turn: " + turn }}</p>
          <button @click="drawRandomOneCard(wantCard)">drawSelectCard</button>
          <input v-model="wantCard" type="number" />
          <button @click="isBGM = !isBGM">bgm: <span :class="isBGM ? ` text-red-600` : `text-blue-600`">{{ isBGM ? "ON" :
            "OFF"
          }}</span></button>
          <button @click="status.hp -= 10">hp-10</button>
          <button @click="status.hungry -= 10">hungry-10</button>
          <button @click="status.contribution += 100">contribution+100</button>
        </div>
      </div>

      <transition appear enter-from-class="translate-y-[-150%] opacity-0" leave-to-class="translate-y-[150%] opacity-0"
        leave-active-class="transition duration-300" enter-active-class="transition duration-300">
        <div class="overlay">
          <div v-if="phase === 'shop'">
            <Shop />
          </div>

          <div v-if="phase === 'battle'">
            <Battle />
          </div>
        </div>
      </transition>

      <div v-if="components !== 'postBattle'">
        <div style="width: 40vw;" class="inset-0 top-1/3 left-0 fixed ml-2">
          {{ components }}
          <UiUseCard :player="sign === firstAtkPlayer ? player : enemyPlayer"
            :playerAllocation="!XOR(sign === firstAtkPlayer, sign === 0) ? true : false"
            v-show="components !== 'secondAtk'" />
          <UiUseCard :player="sign !== firstAtkPlayer ? player : enemyPlayer"
            :playerAllocation="!XOR(sign !== firstAtkPlayer, sign === 0) ? true : false" />
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

      <div class="bottom-0 fixed mb-3">
        <img v-if="(cardLock && phase === 'battle' && components === 'postBattle') || (phase === 'shop' && check)"
          src="/gifs/waiting.gif" class="bottom-0 fixed mb-36" style="width: 40vw;" />
        <div class="flex justify-start" style="width: 95vw;">
          <UiStatus :player="player" />
          <UiGifts :gifts="gifts" :player="player" class="w-1/5" />
          <UiMission class="ml-auto" />
        </div>
        <UiHand class="pt-5" />
      </div>

    </div>
  </div>
</template>
