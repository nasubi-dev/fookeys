<script setup lang="ts">
import { toRefs, ref, watch } from "vue";
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import bianca from "@/assets/img/companys/bianca.png";
import bulbull from "@/assets/img/companys/bulbull.png";
import galdaybee from "@/assets/img/companys/galdaybee.png";
import hanamie from "@/assets/img/companys/hanamie.png";
import norma from "@/assets/img/companys/norma.png";
import rapidpot from "@/assets/img/companys/rapidpot.png";
import unlimit from "@/assets/img/companys/unlimit.png";

const { pushHand, popHand } = playerStore;
const { player, cardLock } = storeToRefs(playerStore);
const { hand } = toRefs(player.value);

const isHandSelected = ref([false, false, false, false, false, false, false, false, false]);
//WatchでCardLockを監視して､trueになったら使用するカードを手札から削除する
watch(cardLock, (newVal) => {
  if (newVal) {
    const deleteIndex = isHandSelected.value.reduce((acc: number[], bool, index) => {
      if (bool) acc.unshift(index);
      return acc;
    }, []);
    deleteIndex.forEach((index) => {
      hand.value.splice(index, 1);
      isHandSelected.value[index] = false;
    });
    console.log(i, "deleteHand: ", "hand: ", hand.value.map((card) => card.name));
  }
})

//HandからFieldへ
const pushCard = (index: number) => {
  if (cardLock.value) return;
  if (isHandSelected.value[index]) throw new Error("failed to pushCard");
  isHandSelected.value[index] = !isHandSelected.value[index]
  pushHand(index)
};
//FieldからHandへ
const popCard = (index: number, id: number) => {
  if (cardLock.value) return;
  if (!isHandSelected.value[index]) throw new Error("failed to popCard");
  isHandSelected.value[index] = !isHandSelected.value[index]
  popHand(index, id)
};
</script>

<template>
  <div>
    <ul class="text-xs flex justify-start">
      <div v-for="(card, index) in hand" :key="card.id">
        <div v-if="!card.rotten">
          <button @click="!isHandSelected[index] ? pushCard(index) : popCard(index, card.id)"
            :class="isHandSelected[index] ? 'transform -translate-y-2' : null" class="overCard">
            <img v-if="card.company === 'bianca'" :src="bianca" /><!--! ばかみたいな解決法 -->
            <img v-if="card.company === 'bulbull'" :src="bulbull" />
            <img v-if="card.company === 'galdaybee'" :src="galdaybee" />
            <img v-if="card.company === 'hanamie'" :src="hanamie" />
            <img v-if="card.company === 'norma'" :src="norma" />
            <img v-if="card.company === 'rapidpot'" :src="rapidpot" />
            <img v-if="card.company === 'unlimit'" :src="unlimit" />
            <div class="overText">
              <h5>{{ card.name }}</h5>
              <p>ID:{{ card.id }}</p>
              <p>📊🚬:{{ card.company }}</p>
              <p>{{ "🍃:" + card.waste + "🍖: " + card.hungry }}</p>
              <div v-if="card.priority">
                <p>{{ "🦶: " + card.priority }}</p>
              </div>
              <div v-if="card.atk">
                <p>{{ "⚔:" + card.atk }}</p>
              </div>
              <div v-if="card.def">
                <p>{{ "🛡:" + card.def }}</p>
              </div>
              <div v-if="card.tech">
                <p>{{ "🏹:" + card.tech }}</p>
              </div>
              <div v-if="card.heal">
                <p>{{ "💖:" + card.heal }}</p>
                </div>
            </div>
          </button>
        </div>
        <div v-else>
          <div :class="isHandSelected[index] ? 'bg-red-100' : 'bg-blue-100'"
            class="w-30 h-30 rounded-lg p-4 flex flex-col justify-center items-center">
            <h5 class="text-bold">腐ってます!!!!!</h5>
          </div>
        </div>
      </div>
    </ul>
    {{ isHandSelected }}
  </div>
</template>
