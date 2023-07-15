import { createApp } from "vue";
import "./main.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { notivue } from "notivue";
import { usePlayerStore, useGameStore } from "./store";
import 'notivue/notifications.css'
import 'notivue/animations.css'

const pinia = createPinia();
createApp(App).use(router).use(pinia).use(notivue).mount("#app");

const playerStore = usePlayerStore();
const gameStore = useGameStore();

export { playerStore, gameStore };
