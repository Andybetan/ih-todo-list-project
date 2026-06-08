<script setup>
import { computed } from 'vue'

const props = defineProps({
  context: { type: String, default: 'no-tasks' }
})

const content = computed(() => {
  const map = {
    'no-tasks':     { title: '¡Aún no tienes tareas!',          subtitle: 'Añade tu primera tarea arriba para comenzar.' },
    'no-pending':   { title: '¡Todo al día!',                    subtitle: 'No tienes tareas pendientes. Buen trabajo.' },
    'no-completed': { title: 'Nada completado aún',              subtitle: 'Completa tu primera tarea para verla aquí.' },
    'no-results':   { title: 'Sin resultados',                   subtitle: 'No hay tareas que coincidan con tu búsqueda.' }
  }
  return map[props.context] || map['no-tasks']
})
</script>

<template>
  <div class="task-empty">
    <!-- Clipboard: no tasks at all -->
    <svg v-if="context === 'no-tasks'" class="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="2" width="6" height="4" rx="1"/>
      <path d="M9 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-3"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>

    <!-- Check circle: all done, no pending tasks -->
    <svg v-else-if="context === 'no-pending'" class="empty-icon success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>

    <!-- Hourglass: nothing completed yet -->
    <svg v-else-if="context === 'no-completed'" class="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 22h14"/>
      <path d="M5 2h14"/>
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/>
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>
    </svg>

    <!-- Magnifying glass with X: no search results -->
    <svg v-else-if="context === 'no-results'" class="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
      <path d="m8.5 8.5 5 5"/>
      <path d="m13.5 8.5-5 5"/>
    </svg>

    <p class="empty-title">{{ content.title }}</p>
    <p class="empty-subtitle">{{ content.subtitle }}</p>
  </div>
</template>

<style scoped>
.task-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 20px;
  color: #aaa;
}

.empty-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
  color: #d0d0d0;
}

.empty-icon.success {
  color: #42b883;
  opacity: 0.6;
}

.empty-title {
  font-size: 17px;
  font-weight: 600;
  color: #888;
  margin: 0 0 8px;
}

.empty-subtitle {
  font-size: 14px;
  color: #bbb;
  margin: 0;
}
</style>
