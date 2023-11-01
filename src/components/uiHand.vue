<script setup lang="ts">
import { toRefs, ref, watch } from "vue";
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { useSound } from "@vueuse/sound";
import { tap1 } from "@/assets/sounds";
import type { PlayerData } from "@/types";
import { db } from "../server/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { converter } from "@/server/converter";
import { watchTurnEnd } from "@/server/useShop";
import UiCard from "@/components/uiCard.vue";
import allCards from "@/assets/allCards";

const useTap1 = useSound(tap1);

const playersRef = collection(db, "players").withConverter(converter<PlayerData>());

const { pushHand, popHand } = playerStore;
const { player, cardLock, log, sumCards } = storeToRefs(playerStore);
const { hand, field, idEnemy, status, donate } = toRefs(player.value);

const handSelected = ref([false, false, false, false, false, false, false, false, false]);
watch(donate, () => {
  handSelected.value = [false, false, false, false, false, false, false, false, false];
  field.value = [];
})
//WatchでCardLockを監視して､trueになったら使用するカードを手札から削除する
watch(cardLock, async (newVal) => {
  if (newVal) {
    const deleteIndex = handSelected.value.reduce((acc: number[], bool, index) => {
      if (bool) acc.unshift(index);
      return acc;
    }, []);
    deleteIndex.forEach((index) => {
      hand.value.splice(index, 1);
      handSelected.value[index] = false;
    });
    console.log(i, "deleteHand: ", "hand: ", hand.value.map((card) => card.name));
    await watchTurnEnd();
  }
})
//HandからFieldへ
const pushCard = async (index: number) => {
  if (cardLock.value) return;
  if (!donate.value && status.value.hungry + sumCards.value.hungry + allCards[hand.value[index].id].hungry > status.value.maxHungry) {
    log.value = "お腹がいっぱいでこれ以上食べれない！"
    return;
  }
  const enemyGift = (await getDoc(doc(playersRef, idEnemy.value))).data()?.isSelectedGift as number | undefined;
  if (enemyGift === 3 && field.value.length >= 3) {
    log.value = "相手のギフトの効果により､このラウンド中3枚までしか使えない"
    return;
  }
  if (enemyGift === 11 && allCards[hand.value[index].id].attribute !== "atk") {
    log.value = "相手のギフトの効果により､このラウンド中マッスルカードしか使えない"
    return;
  }

  if (handSelected.value[index]) throw new Error("failed to pushCard");
  handSelected.value[index] = !handSelected.value[index]
  pushHand(index)
};
//FieldからHandへ
const popCard = (index: number, id: number) => {
  if (cardLock.value) return;
  if (!handSelected.value[index]) throw new Error("failed to popCard");
  handSelected.value[index] = !handSelected.value[index]
  popHand(index, id)
};
</script>

<template>
  <div class=" flex justify-start overflow-clip">
    <transition-group enter-from-class="translate-y-[-150%] opacity-0" leave-to-class="translate-y-[150%] opacity-0"
      leave-active-class="transition duration-300" enter-active-class="transition duration-300">
      <div v-if="hand.length === 0" class="cardSize">
        <img width="912" src="../assets/img/alpha.png" />
      </div>
      <div v-else v-for="(card, index) in hand" :key="card.id">
        <div v-if="!card.rotten">
          <button
            @click="!handSelected[index] ? pushCard(index) : popCard(index, card.id); cardLock ? null : useTap1.play()"
            :class="handSelected[index] ? 'transform -translate-y-4' : null" class="cardSize relative">
            <UiCard :card="card" size="normal" />
          </button>
        </div>
        <div v-else>
          <button @click="log = '腐ったカードは使えない'" class="cardSize relative">
            <UiCard :card="card" size="normal" />
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>
