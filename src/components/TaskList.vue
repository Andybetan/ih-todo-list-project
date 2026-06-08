<script setup>
import TaskItem from '@/components/TaskItem.vue'
import TaskEmpty from '@/components/TaskEmpty.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
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

    <ul v-if="tasks.length > 0" class="tasks-list">
      <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
    </ul>

    <TaskEmpty v-else />
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
</style>
