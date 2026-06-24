import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'menu',
      component: () => import("@/views/Menu.vue")
    },
    {
      path: '/game',
      name: 'game',
      component: () => import("@/views/GameField.vue")
    },
  ],
})

export default router
