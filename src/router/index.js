import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: "/Dialog",
        component: () => import("@/views/Dialog/index.vue"),
    },
    {
        path: "/Form",
        component: () => import("@/views/Form/index.vue"),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router;