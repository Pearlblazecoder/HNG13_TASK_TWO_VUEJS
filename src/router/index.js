import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/auth'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../pages/Landing.vue')
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/auth/signup',
    name: 'Signup',
    component: () => import('../pages/Signup.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets',
    name: 'Tickets',
    component: () => import('../pages/Tickets.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    next('/auth/login')
  } else {
    next()
  }
})

export default router