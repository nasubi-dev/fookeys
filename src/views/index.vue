<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { Notivue, Notifications } from 'notivue'
import { playerStore } from "@/main";
import { storeToRefs } from "pinia";
import { registerPlayer } from "@/server/usePlayerData";
import { useSound } from "@vueuse/sound";
import { tap1 } from "@/assets/sounds";
import { usePush } from 'notivue'
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

//アプリが起動したらユーザーIDを取得する ユーザー名が空の場合はNo name
const newName = ref("");
async function register() {
  newName.value === "" ? (name.value = "No name") : (name.value = newName.value);
  id.value == "" ? await registerPlayer() : log.value = "idは既に登録されています"
}
</script>

<template>
  <div>
    <Notivue v-slot="item">
      <Notifications :item="item" />
    </Notivue>
    <div class="flex flex-col items-center justify-center h-screen">
      このゲームはCSS初心者が作っているのでiPadのサイズに合わせて作られています｡<br />
      そのため､PCでプレイする際は画面サイズを縮小してプレイしていただけると幸いです｡
      <img src="@/assets/img/ui/fookeys.png" class="w-60" />
      <form class="flex flex-col items-center">
        <input class="border border-gray-400 rounded-lg p-2 w-64" type="text" placeholder="please name"
          v-model="newName" />
        <router-link to="/menu" @click="register(); useTap1.play()" type="button"
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-2 btn-pop">
          <button>Menu</button>
        </router-link>
      </form>
      <button @click="log = 'test'">test</button>
    </div>
  </div>
</template>