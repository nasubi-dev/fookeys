<script setup lang="ts">
import { toRefs, ref, onMounted, watch } from "vue";
import { e, s, i } from "@/log";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { watchShopEnd } from "@/server/useShop";
import decide from "@/assets/img/ui/decide.png";
import allGifts from "@/assets/allGifts";
import UiGiftsGift from "./uiGiftsGift.vue";

const { player, log } = storeToRefs(playerStore);
const { gifts, status, isSelectedGift } = toRefs(player.value);

const pushed = ref(false);
onMounted(() => {
  console.log(i, "gift: ", allGifts[gifts.value[0]]?.name, allGifts[gifts.value[1]]?.name, allGifts[gifts.value[2]]?.name);
  pushed.value = false;
})
const useGift = async () => {
  pushed.value = true;
  await watchShopEnd();
}
</script>

<template>
  <div>
    <transition-group enter-from-class="translate-y-[-150%] opacity-0" leave-to-class="translate-y-[150%] opacity-0"
      leave-active-class="transition duration-300" enter-active-class="transition duration-300">

      <div v-if="!pushed" class="flex justify-start">
        <button @click="useGift()">
          <img :src="decide" style="width: 20vw;" />
        </button>
        <div class="flex flex-row w-auto h-auto">
          <div v-for="gift in gifts" :key="gift">
            <div :class="isSelectedGift === gift ? 'transform -translate-y-5' : null">
              <button
                @click="status.contribution < allGifts[gift].requireContribution ? log = '貢献度が足りません' : isSelectedGift !== gift ? isSelectedGift = gift : isSelectedGift = undefined"
                class="cardSize">
                <UiGiftsGift :gift="gift" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>