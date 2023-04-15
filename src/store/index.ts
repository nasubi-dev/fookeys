import { ref } from "vue";
import { createPinia, defineStore } from "pinia";

export const usePlayerStore = defineStore("playerInfo", {
  state: () => ({
    id: ref(""),
    name: ref(""),
    character: ref(0),
    gift: ref(0),
  }),
});

export const pinia = createPinia();
