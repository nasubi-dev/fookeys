<script setup lang="ts">
import { toRefs, ref, watch } from "vue";
import { e, s, i } from "@/log";
import { playerStore, } from "@/main";
import type { PlayerData } from "@/types";
import { storeToRefs } from "pinia";
import { db } from "../server/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { converter } from "@/server/converter";
import { watchTurnEnd } from "@/server/useShop";
import UiCard from "@/components/uiCard.vue";
import allCards from "@/assets/allCards";

const playersRef = collection(db, "players").withConverter(converter<PlayerData>());

const { pushHand, popHand } = playerStore;
const { player, cardLock, log } = storeToRefs(playerStore);
const { hand, field, idEnemy, isSelectedGift } = toRefs(player.value);



const handSelected = ref([false, false, false, false, false, false, false, false, false]);
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
  if (isSelectedGift.value === 7 && allCards[hand.value[index].id].attribute === 'atk') {
    console.log(i, "atk card do double damage");
    log.value = "atk card do double damage"
  }
  const enemyGift = (await getDoc(doc(playersRef, idEnemy.value))).data()?.isSelectedGift as number | undefined;
  console.log(i, "isSelectedGift: ", enemyGift, "fieldLength: ", field.value.length);
  if (enemyGift === 3 && field.value.length >= 3) {
    console.log(i, "field is full");
    log.value = "field is full"
    return;
  }
  if (enemyGift === 11 && allCards[hand.value[index].id].attribute !== "atk") {
    console.log(i, "only atk card can be set");
    log.value = "only atk card can be set"
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
      <div v-for="(card, index) in hand" :key="card.id">
        <div v-if="!card.rotten">
          <button @click="!handSelected[index] ? pushCard(index) : popCard(index, card.id)"
            :class="handSelected[index] ? 'transform -translate-y-4' : null" class="cardSize">
            <UiCard :card="card" />
          </button>
        </div>
        <div v-else>
          <div :class="handSelected[index] ? 'bg-red-100' : 'bg-blue-100'"
            class="rounded-lg p-4 flex flex-col items-center">
            <h5 class="text-bold">腐ってます!</h5>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>
