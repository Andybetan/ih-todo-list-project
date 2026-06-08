<script setup>
import TaskItem from '@/components/TaskItem.vue'
import TaskEmpty from '@/components/TaskEmpty.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <section class="tasks-section">
    <div class="task-count-container">
      <span class="task-count">Total tasks: {{ tasks.length }}</span>
      <span class="completed-count">
        Completed: {{ tasks.filter(t => t.completed).length }}
      </span>
    </div>

    <div v-if="loading" class="tasks-loading">
      <span class="loading-spinner"></span>
      <span>Cargando tareas...</span>
    </div>

    <template v-else>
      <ul v-if="tasks.length > 0" class="tasks-list">
        <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
      </ul>
      <TaskEmpty v-else />
    </template>
  </section>
</template>

<style scoped>
.tasks-section {
  margin-top: 40px;
}

.task-count-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 10px;
}

.task-count, .completed-count {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.tasks-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
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
