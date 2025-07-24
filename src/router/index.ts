import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/Jesus'
  },
  {
    path: '/Jesus',
      component: () => import('../views/Menu/JesusPages.vue')
  },
  {
      path: '/M4A',
      component: () => import('../views/Menu/M4APages.vue')
  },
  
  {
      path: '/PLI',
      component: () => import('../views/Menu/PLIPages.vue')
  },
  {
      path: '/About',
      component: () => import('../views/Menu/AboutPages.vue')
  },
  {
      path: '/Twitter',
      component: () => import('../views/TwitterPage.vue')
  }
]

const router = createRouter(
{
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
