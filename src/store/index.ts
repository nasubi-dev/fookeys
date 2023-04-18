import { ref } from "vue";
import { createPinia, defineStore } from "pinia";

export const usePlayerStore = defineStore("playerInfo", {
  state: () => ({
    id: ref(""),
    idEnemy: ref(""),
    idGame: ref(""),
    name: ref(""),
    character: ref(0),
    gift: ref(0),
  }),
});

export const pinia = createPinia();
