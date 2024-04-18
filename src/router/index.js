import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignUpView from '@/views/SignUpView.vue' // Importa SignUpView

import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('@/views/SignInView.vue')
    },

    {
      path: '/signup', 
      name: 'signup',
      component: SignUpView // Usa SignUpView directamente
    },

    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (userStore.user === undefined) {
    await userStore.fetchUser()
  }

  if (userStore.user === null && to.name !== 'signin' && to.name !== 'signup') {
    // Si el usuario no está autenticado y la ruta no es 'signin' ni 'signup',
    // redirigir al usuario a la página de registro (SignUp)
    next({ name: 'signup' });
  } else {
    next();
  }
});

export default router;