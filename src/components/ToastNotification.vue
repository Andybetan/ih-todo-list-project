<script setup>
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()
</script>

<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
        >
          <span class="toast-icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  max-width: 340px;
}

.toast--success {
  background: #f0faf4;
  color: #1a6635;
  border: 1px solid #a3d9b5;
}

.toast--error {
  background: #fff0f0;
  color: #9b1c1c;
  border: 1px solid #f5a0a0;
}

.toast-icon {
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.toast-enter-active {
  transition: all 0.25s ease;
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
