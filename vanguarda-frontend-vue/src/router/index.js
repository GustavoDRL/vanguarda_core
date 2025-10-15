import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/simulador'
    },
    {
      path: '/simulador',
      name: 'Simulador',
      component: () => import('@/views/Simulador.vue')
    }
  ]
})

export default router
