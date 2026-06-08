<script setup>
import { ref } from 'vue'
import { useTasksStore } from '@/stores/tasksStore'
import { useToast } from '@/composables/useToast'

const tasksStore = useTasksStore()
const { success, error } = useToast()
const taskTitle = ref('')
const isSubmitting = ref(false)

const addTask = async () => {
  if (!taskTitle.value.trim()) return
  isSubmitting.value = true
  try {
    await tasksStore.createNewTask({
      title: taskTitle.value.trim(),
      completed: false,
      favorite: false,
      priority: 'normal'
    })
    success('Tarea creada')
    taskTitle.value = ''
  } catch (err) {
    error('Error al crear la tarea: ' + (err.message || 'Inténtalo de nuevo'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="input-container">
    <input
      type="text"
      v-model="taskTitle"
      placeholder="Enter task title"
      class="task-input"
      @keydown.enter="addTask"
    />
    <button class="create-task-btn" @click="addTask" :disabled="isSubmitting">
      {{ isSubmitting ? 'Creando...' : 'Create' }}
    </button>
  </div>
</template>

<style scoped>
.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;
}

.task-input {
  flex: 1;
  max-width: 500px;
  height: 45px;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.task-input:focus {
  outline: none;
  border-color: #42b883;
}

.create-task-btn {
  height: 45px;
  padding: 12px 24px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.create-task-btn:hover {
  background-color: #35a372;
}

.create-task-btn:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}
</style>
