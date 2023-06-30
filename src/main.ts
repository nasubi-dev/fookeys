import { createApp } from "vue";
import "./main.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { usePlayerStore, useGameStore } from "./store";

const pinia = createPinia();
createApp(App).use(router).use(pinia).mount("#app");

const playerStore = usePlayerStore();
const gameStore = useGameStore();

export { playerStore, gameStore };
