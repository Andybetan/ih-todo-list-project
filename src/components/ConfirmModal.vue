<script setup>
import { useConfirm } from '@/composables/useConfirm'

const { visible, message, accept, cancel } = useConfirm()
</script>

<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="cancel">
        <div class="modal-card">
          <p class="modal-message">{{ message }}</p>
          <div class="modal-actions">
            <button class="modal-btn modal-btn--cancel" @click="cancel">Cancelar</button>
            <button class="modal-btn modal-btn--confirm" @click="accept">Eliminar</button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99998;
}

.modal-card {
  background: white;
  border-radius: 14px;
  padding: 28px 32px;
  max-width: 360px;
  width: 90%;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-message {
  font-size: 16px;
  color: #333;
  margin: 0 0 24px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn--cancel {
  background: #f0f0f0;
  color: #555;
}

.modal-btn--cancel:hover {
  background: #e0e0e0;
}

.modal-btn--confirm {
  background: #ff4444;
  color: white;
}

.modal-btn--confirm:hover {
  background: #cc0000;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: scale(0.95);
}
</style>
