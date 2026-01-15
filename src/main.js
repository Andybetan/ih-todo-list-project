import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Manejo de errores global
window.addEventListener('error', (event) => {
  console.error('Error global:', event.error)
  const errorDiv = document.getElementById('loading-error')
  if (errorDiv) {
    errorDiv.classList.add('show')
    const errorBox = errorDiv.querySelector('.error-box p')
    if (errorBox && event.error && event.error.message) {
      errorBox.textContent = event.error.message
    }
  }
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rechazada:', event.reason)
  const errorDiv = document.getElementById('loading-error')
  if (errorDiv) {
    errorDiv.classList.add('show')
  }
})

// Intentar inicializar la aplicación
async function initApp() {
  try {
    const app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.mount('#app')
    console.log('✅ Aplicación montada correctamente')
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error)
    const errorDiv = document.getElementById('loading-error')
    if (errorDiv) {
      errorDiv.classList.add('show')
      const errorBox = errorDiv.querySelector('.error-box p')
      if (errorBox) {
        errorBox.textContent = error.message || 'Error desconocido al inicializar la aplicación'
      }
    }
  }
}

// Inicializar después de que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
