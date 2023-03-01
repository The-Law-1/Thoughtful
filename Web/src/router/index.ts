import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import indexVue from "@/pages/index.vue";
import defaultLayout from "@/layouts/default.vue";
import NotFoundView from "@/pages/404.vue";
import loginVue from "@/pages/login.vue";
import toolsVue from "@/pages/tools.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: indexVue,
      meta: {
        layout: defaultLayout,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFoundView,
      meta: {
        layout: defaultLayout,
      },
    },
    {
        path: "/tools",
        name: "tools",
        component: toolsVue,
        meta: {
            layout: defaultLayout,
        },
    },
    {
        path: "/login",
        name: "login",
        component: loginVue,
        meta: {
            layout: defaultLayout,
        },
    }
  ],
});

router.beforeEach(async (to) => {
    const auth = useAuthStore();

    if (to.name === "login") {
        return;
    }
    if (auth.jwtToken === null) {
        return "/login";
    }

  // how does this work?
//   if (!to.meta?.signedIn) {
//     return;
//   }
//   if (!auth.jwtToken) {
//     return "/login";
//   }
//   if (auth.jwtPayload.exp < Date.now() / 1000) {
//     if (!auth.canRefreshToken) return "/login";
//     const state = promistate(async () => await auth.refresh());
//     await state.load();
//     if (state.error) {
//       return "/login";
//     }
//   }
});

export default router;
