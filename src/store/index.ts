import { ref } from "vue";
import { createPinia, defineStore } from "pinia";

export const usePlayerStore = defineStore("playerData", {
  state: () => ({
    id: ref(""),//･ﾟ･(｡>ω<｡)･ﾟ･
    idGame: ref(""),
    name: ref(""),
    character: ref(0),
    gift: ref(0),
  }),
});

export const pinia = createPinia();
