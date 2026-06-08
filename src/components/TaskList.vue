<script setup>
import TaskItem from '@/components/TaskItem.vue'
import TaskEmpty from '@/components/TaskEmpty.vue'

defineProps({
  tasks:          { type: Array,   required: true },
  loading:        { type: Boolean, default: false },
  totalCount:     { type: Number,  default: 0 },
  pendingCount:   { type: Number,  default: 0 },
  completedCount: { type: Number,  default: 0 },
  emptyContext:   { type: String,  default: 'no-tasks' }
})
</script>

<template>
  <section class="tasks-section">
    <div class="counters">
      <div class="counter-chip total">
        <span class="counter-value">{{ totalCount }}</span>
        <span class="counter-label">Total</span>
      </div>
      <div class="counter-chip pending">
        <span class="counter-value">{{ pendingCount }}</span>
        <span class="counter-label">Pendientes</span>
      </div>
      <div class="counter-chip completed">
        <span class="counter-value">{{ completedCount }}</span>
        <span class="counter-label">Completadas</span>
      </div>
    </div>

    <div v-if="loading" class="tasks-loading">
      <span class="loading-spinner"></span>
      <span>Cargando tareas...</span>
    </div>

    <template v-else>
      <ul v-if="tasks.length > 0" class="tasks-list">
        <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
      </ul>
      <TaskEmpty v-else :context="emptyContext" />
    </template>
  </section>
</template>

<style scoped>
.tasks-section {
  margin-top: 24px;
}

.counters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.counter-chip {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 12px;
  background: #f8f8f8;
  border: 1px solid #efefef;
}

.counter-chip.total {
  background: #f0f8ff;
  border-color: #d0e8ff;
}

.counter-chip.pending {
  background: #fff8f0;
  border-color: #ffe0c0;
}

.counter-chip.completed {
  background: #f0faf4;
  border-color: #c0e8d0;
}

.counter-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}

.counter-chip.total .counter-value     { color: #4285f4; }
.counter-chip.pending .counter-value   { color: #f5a623; }
.counter-chip.completed .counter-value { color: #42b883; }

.counter-label {
  font-size: 11px;
  font-weight: 500;
  color: #999;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.tasks-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tasks-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 0;
  color: #999;
  font-size: 15px;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #e0e0e0;
  border-top-color: #42b883;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
