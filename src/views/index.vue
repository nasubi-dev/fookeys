<script setup lang="ts">
import { ref, toRefs, watch,onMounted } from "vue";
import { usePush, Notivue, Notifications, filledIcons } from 'notivue'
import { useSound } from "@vueuse/sound";
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { registerPlayer,reNamePlayer } from "@/server/usePlayerData";
import { tap1 } from "@/assets/sounds";
import myLogImg from "@/components/myLog.vue";
import enemyLogImg from "@/components/enemyLog.vue";
import { tryOnMounted } from "@vueuse/core";

const customIcons = {
  success: myLogImg,
  error: enemyLogImg,
  info: filledIcons.info,
  close: filledIcons.close,
  promise: filledIcons.promise
}
const push = usePush()

//storeの参照
const { id, player, log } = storeToRefs(playerStore);
const { name } = toRefs(player.value);

const useTap1 = useSound(tap1);
watch(log, () => {
  if (log.value === "") return
  push.info({
    message: log.value,
    duration: 18000,
  })
  log.value = ""
})

const newName = ref("");
onMounted(async () => {
  newName.value = name.value;
  await registerPlayer();
  await reNamePlayer(name.value);
})
//アプリが起動したらユーザーIDを取得する ユーザー名が空の場合はNo name
async function register() {
  newName.value === "" ? (name.value = "No name") : (name.value = newName.value);
  await reNamePlayer(name.value);
  id.value == "" ? await registerPlayer() : log.value = "idは既に登録されています"
}
</script>

<template>
  <div>
    <Notivue v-slot="item">
      <Notifications :item="item" :icons="customIcons" />
    </Notivue>
    <div class="flex flex-col items-center justify-center h-screen">
      このゲームはCSS初心者が作っているのでレスポンシブを理解していません｡<br />
      iPadのサイズで作成しているため､PCでプレイする際は画面サイズを縮小してプレイしていただけると幸いです｡<br />
      問題が発生した場合、一度この画面に戻ってサイトをリロードしてください。<br />
      <a href="https://minimi-323.hatenablog.com/entry/2023/05/26/222715" target="_blank" class=" text-yellow-300">説明書リンク</a><br />
      <img src="@/assets/img/ui/fookeys.png" class="w-60" />
      <form class="flex flex-col items-center">
        <input class="border border-gray-400 rounded-lg p-2 w-64" type="text" placeholder="please name"
          v-model="newName" />
        <router-link to="/menu" @click="register(); useTap1.play()" type="button"
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2 btn-pop">
          <button>Menu</button>
        </router-link>
      </form>
    </div>
  </div>
</template>