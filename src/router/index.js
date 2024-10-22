import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/items',
      name: 'items',
      component: () => import('@/views/ItemsView.vue')
    },

    {
      path: '/types',
      name: 'types',
      component: () => import('@/views/TypesVIew.vue')
    },

    {
      path: '/subtypes',
      name: 'subtypes',
      component: () => import('@/views/SubTypesView.vue')
    }
  ]
})

export default router
