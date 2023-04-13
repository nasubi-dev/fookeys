import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/index.vue";
import Menu from "../views/menu.vue";
import Character from "../views/character.vue";
import Gift from "../views/gift.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
  ],
});

export default router;
