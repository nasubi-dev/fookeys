import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/index.vue";
import Menu from "../views/menu.vue";
import Character from "../views/character.vue";
import Gift from "../views/gift.vue";
import Battle from "../views/battle.vue";

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/menu",
      name: "menu",
      component: Menu,
    },
    {
      path: "/character",
      name: "character",
      component: Character,
    },
    {
      path: "/gift",
      name: "gift",
      component: Gift,
    },
    {
      path: "/battle/:gameID",
      name: "battle",
      component: Battle,
    },
  ],
});

export default router;
