<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { e, s, i } from "@/log";
import type { Mission } from "@/types";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { setHand } from "@/server/useShopUtils";
import UiHand from "@/components/uiHand.vue";

//storeの参照
const { id, player,log } = storeToRefs(playerStore);
const { name, hand, status } = toRefs(player.value);

const onLongPressCallbackHook = () => {
  console.log("longPress");
  log.value = "longPress";
};

</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <VLongPress :on-long-press="onLongPressCallbackHook" :delay="1000">
      <div class="w-64 h-64 bg-red-500"></div>
    </VLongPress>
  </div>
</template>
