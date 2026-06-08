<script setup>
import { ref } from 'vue'
import { useTasksStore } from '@/stores/tasksStore'

const tasksStore = useTasksStore()
const taskTitle = ref('')

const addTask = async () => {
  if (!taskTitle.value.trim()) return
  try {
    await tasksStore.createNewTask({
      title: taskTitle.value.trim(),
      completed: false,
      favorite: false,
      priority: 'normal'
    })
    taskTitle.value = ''
  } catch (error) {
    console.error('Error creating task:', error)
    alert('Error al crear la tarea: ' + (error.message || 'Verifica que las columnas favorite y priority existan en la base de datos'))
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
    <button class="create-task-btn" @click="addTask">
      Create
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
</style>
