import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/index.vue";
import Menu from "../views/menu.vue";
import Battle from "../views/battle.vue";
import Test from "../views/test.vue";

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
      path: "/battle/:idGame",
      name: "battle",
      component: Battle,
    },
    {
      path: "/test",
      name: "test",
      component: Test,
    },
  ],
});

export default router;
