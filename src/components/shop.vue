<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import ShopDrawCards from './shopDrawCards.vue';
import ShopUseGifts from './shopUseGifts.vue';

const { cardLock, phase } = storeToRefs(playerStore);

const use = ref(false);
const draw = ref(false);
//WatchでCardLockを監視して､trueになったらuseとdrawをfalseにする
watch(cardLock, (newVal) => {
  if (newVal) {
    use.value = false;
    draw.value = false;
  }
})

const shopAnimation = ref(true);
onMounted(() => {
  setTimeout(() => {
    shopAnimation.value = false;
  }, 1000);
})
watch(phase, (newVal) => {
  if (newVal === 'shop') {
    shopAnimation.value = true;
  }
})
</script>

<template>
  <div>
    <transition appear enter-from-class="translate-y-[-150%] opacity-0" leave-to-class="translate-y-[150%] opacity-0"
      leave-active-class="transition duration-300" enter-active-class="transition duration-300" mode="out-in">
      <div v-if="shopAnimation">
        Shop Phase // ここにアニメーションを入れる
      </div>
      <div v-else>
        <div v-if="draw">
          <ShopDrawCards />
        </div>
        <div v-else-if="use">
          <ShopUseGifts />
        </div>
        <div v-else class="flex justify-start">
          <div class="overCard" style="width: 20vw;">
            <button @click="draw = !draw">
              <img :src="`img/ui/drawCard.png`" />
            </button>
          </div>
          <div class="overCard">
            <button @click="use = !use" style="width: 20vw;">
              <img :src="`img/ui/useGift.png`" />
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>