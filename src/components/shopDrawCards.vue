<script setup lang="ts">
import { toRefs, ref } from "vue";
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { watchShopEnd } from "@/server/useShop";
import type { Card } from "@/types";
import uiHandCard from "./uiCard.vue";
import decide from "@/assets/img/ui/decide.png";

const { offer, player, phase, log } = storeToRefs(playerStore);
const { hand, check } = toRefs(player.value);

const isOfferSelected = ref([false, false, false]);
//選択を確定させたらHandにtrueのカードを追加して､offerを空にする
const offerHand = async () => {
  const offerHand: Card[] = offer.value.filter((card, index) => isOfferSelected.value[index]);
  console.log(i, "offer2Hand: ", offerHand.map((card) => card.name));
  hand.value.push(...offerHand);
  if (hand.value.length > 9) {
    console.log(i, "hand is full");
    log.value = "手札がいっぱいです"
    hand.value.splice(9, hand.value.length - 9);
  }
  hand.value = [...hand.value].sort((a, b) => a.id - b.id);
  console.log(i, "offer2Hand");
  //!今のままだと選択確定を押さなければofferが残るが､ポップアップになる予定なのでOk
  offer.value.splice(0, offer.value.length);
  isOfferSelected.value = [false, false, false];
  await watchShopEnd();
}

</script>

<template>
  <div>
    <div v-if="phase === 'shop'" class="flex justify-start">
      <button @click="offerHand()" :class="check ? 'bg-red-500' : 'bg-blue-500'">
        <img :src="decide" style="width: 20vw;" />
      </button>
      <div class="text-xs flex justify-start">
        <div v-for="(card, index) in offer" :key="card.id">
          <button @click="isOfferSelected[index] = !isOfferSelected[index]">
            <uiHandCard :card="card"
              :class="isOfferSelected[index] ? 'bg-red-100 transform -translate-y-2' : 'bg-blue-100'" class="cardSize" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
