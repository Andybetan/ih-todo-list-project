import { ref } from 'vue'

// Singleton — state shared across all component instances
const toasts = ref([])
let nextId = 0

export function useToast() {
  const show = (message, type = 'success', duration = 3000) => {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  return {
    toasts,
    success: (msg) => show(msg, 'success'),
    error: (msg) => show(msg, 'error', 4000),
  }
}
