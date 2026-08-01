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
    path: '/M4A/:pathMatch(.*)*',
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

router.onError((error, to) =>
{
  const fetchErrors = ['Failed to fetch dynamically imported module', 'text/html', 'ChunkLoadError']
  
  //Check if the error matches our caching issues
  if(fetchErrors.some((e) => error.message.includes(e) || error.name === e))
    window.location.href = to.fullPath //Force a hard reload to the exact page they were trying to go to
})

export default router
