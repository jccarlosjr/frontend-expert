import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

import AppLayout from '../layouts/AppLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import SimulationsView from '../views/SimulationsView.vue'
import AnexoPDFView from '../views/AnexoPDFView.vue'
import SimulationListView from '../views/SimulationListView.vue'

const routes = [
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginView
      }
    ]
  },

  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView
      },
      {
        path: 'simulations',
        name: 'simulations',
        component: SimulationsView
      },
      {
        path: 'anexo-pdf',
        name: 'anexo-pdf',
        component: AnexoPDFView
      },
      {
        path: 'my-simulations',
        name: 'my-simulations',
        component: SimulationListView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('access')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login' })
  }

  if (to.name === 'login' && isAuthenticated) {
    return next({ name: 'home' })
  }

  next()
})

export default router
