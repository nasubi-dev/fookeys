<script setup lang="ts">
import { storeToRefs } from "pinia";
import { playerStore } from "@/main";
import { useSound } from "@vueuse/sound";
import { tap1 } from "@/assets/sounds";
import { usePush } from "notivue";
import { startMatchmaking } from "@/server/useMatchMaking";
import { watch } from "vue";

const p = defineProps<{
  changeLoadMenu: () => void;
}>();


const push = usePush();
const { id, log } = storeToRefs(playerStore);

// eslint-disable-next-line no-undef
watch(log, () => {
  if (log.value === "") return;
  push.info({
    message: log.value,
    duration: 8000,
  });
  log.value = "";
});


const useTap1 = useSound(tap1);
async function startMatch(): Promise<void> {
  if (!id.value) {
    push.warning("IDがありません｡一度トップページに戻ってください");
    return;
  }
  p.changeLoadMenu();
  await startMatchmaking();
}
</script>

<template>
  <div class="flex flex-col gap-20">
    <button @click="
      startMatch();
    useTap1.play();
    " class="btn-pop transform h-full w-full -my-3">
      <div class="relative">
        <img src="@/assets/img/ui/entry.png" />
      </div>
    </button>
    <button @click="
      useTap1.play();
    " class="btn-pop transform h-full w-full -my-3">
      <div class="relative">
        <img src="@/assets/img/ui/entry.png" />
      </div>
    </button>
  </div>
</template>
