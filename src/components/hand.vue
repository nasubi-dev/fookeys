<script setup lang="ts">
import { toRefs, ref, watch } from "vue";
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { getEnemyGift, watchTurnEnd } from "@/server/useShop";
import HandCard from "@/components/handCard.vue";

const { pushHand, popHand } = playerStore;
const { player, cardLock } = storeToRefs(playerStore);
const { hand, field } = toRefs(player.value);

const handSelected = ref([false, false, false, false, false, false, false, false, false]);
//WatchでCardLockを監視して､trueになったら使用するカードを手札から削除する
watch(cardLock, async(newVal) => {
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
  const enemyGift = await getEnemyGift();
  console.log(i, "isSelectedGift: ", enemyGift, "fieldLength: ", field.value.length);
  if (enemyGift === 3 && field.value.length >= 3) {
    console.log(i, "field is full");
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
  <div>
    <ul class="text-xs flex justify-start">
      <div v-for="(card, index) in hand" :key="card.id">
        <div v-if="!card.rotten">
          <button @click="!handSelected[index] ? pushCard(index) : popCard(index, card.id)"
            :class="handSelected[index] ? 'transform -translate-y-2' : null" class="overCard">
            <HandCard :card="card" />
          </button>
        </div>
        <div v-else>
          <div :class="handSelected[index] ? 'bg-red-100' : 'bg-blue-100'"
            class="w-30 h-30 rounded-lg p-4 flex flex-col justify-center items-center">
            <h5 class="text-bold">腐ってます!!!!!</h5>
          </div>
        </div>
      </div>
    </ul>
    {{ handSelected }}
  </div>
</template>
