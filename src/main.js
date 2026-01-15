import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Manejo de errores global
window.addEventListener('error', (event) => {
  console.error('Error global:', event.error)
  // Mostrar error en la página si es un error crítico
  if (event.error && event.error.message && event.error.message.includes('Supabase')) {
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center; padding: 20px; border: 2px solid #ff4444; border-radius: 8px; max-width: 500px;">
          <h1 style="color: #ff4444;">⚠️ Error de Configuración</h1>
          <p style="color: #666;">${event.error.message}</p>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            Por favor, verifica las variables de entorno en Vercel.
          </p>
        </div>
      </div>
    `
  }
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rechazada:', event.reason)
})

try {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  app.mount('#app')
} catch (error) {
  console.error('Error al inicializar la aplicación:', error)
  if (error.message && error.message.includes('Supabase')) {
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center; padding: 20px; border: 2px solid #ff4444; border-radius: 8px; max-width: 500px;">
          <h1 style="color: #ff4444;">⚠️ Error de Configuración</h1>
          <p style="color: #666;">${error.message}</p>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            Por favor, verifica las variables de entorno en Vercel.
          </p>
        </div>
      </div>
    `
  }
}
