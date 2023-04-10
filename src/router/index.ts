import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/index.vue";
import Menu from "../views/menu.vue";

const router = createRouter({
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
  ],
});

export default router;
