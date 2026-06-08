import { ref } from 'vue'

// Singleton — one modal at a time
const visible = ref(false)
const message = ref('')
let resolveCallback = null

export function useConfirm() {
  const confirm = (msg) => {
    message.value = msg
    visible.value = true
    return new Promise((resolve) => {
      resolveCallback = resolve
    })
  }

  const accept = () => {
    visible.value = false
    resolveCallback?.(true)
  }

  const cancel = () => {
    visible.value = false
    resolveCallback?.(false)
  }

  return { visible, message, confirm, accept, cancel }
}
