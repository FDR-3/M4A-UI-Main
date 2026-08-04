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

/*router.onError((error, to) =>
{
  const fetchErrors = ['Failed to fetch dynamically imported module', 'text/html', 'ChunkLoadError']
  
  //Check if the error matches our caching issues
  if(fetchErrors.some((e) => error.message.includes(e) || error.name === e))
    //Force a hard reload to the exact page they were trying to go to
    window.location.href = to.fullPath
})*/

/*router.onError((error, to) =>
{
  const fetchErrors = ['Failed to fetch dynamically imported module', 'text/html', 'ChunkLoadError']
  
  if(fetchErrors.some((e) => error.message.includes(e) || error.name === e))
  {
    const retryKey = `retry_load_${to.path}`
    
    //Check if we already tried to reload this specific path in this session
    if(sessionStorage.getItem(retryKey))
    {
      console.error("Stopping infinite reload loop.", error)
      sessionStorage.removeItem(retryKey) //Clear it out
      return
    }

    //Set the flag in storage so we don't loop
    sessionStorage.setItem(retryKey, 'true')
    
    //Force the hard reload
    window.location.href = to.fullPath
  }
})*/

export default router