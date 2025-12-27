import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/web/'),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/children',
      name: 'Children',
      component: () => import('@/views/Children.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/children/add',
      name: 'AddChild',
      component: () => import('@/views/AddChild.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/children/:id',
      name: 'ChildDetail',
      component: () => import('@/views/ChildDetail.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/library',
      name: 'Library',
      component: () => import('@/views/Library.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: () => import('@/views/Favorites.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/play/:type/:id',
      name: 'Play',
      component: () => import('@/views/Play.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/report',
      name: 'Report',
      component: () => import('@/views/Report.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const isLoggedIn = localStorage.getItem('admin_token')

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
