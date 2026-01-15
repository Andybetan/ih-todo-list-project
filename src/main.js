import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Manejo de errores global
window.addEventListener('error', (event) => {
  console.error('Error global:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rechazada:', event.reason)
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
