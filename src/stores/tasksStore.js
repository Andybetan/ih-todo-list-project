import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  fetchAllTasks,
  createNewTaskAPI,
  deleteTaskAPI,
  updateTaskAPI
} from '@/api/tasksApi'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])

  // 📥 OBTENER TODAS LAS TAREAS
  async function fetchTasks() {
    try {
      const data = await fetchAllTasks()
      tasks.value = data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      tasks.value = []
      throw error
    }
  }

  // ➕ CREAR TAREA
  async function createNewTask(task) {
    try {
      await createNewTaskAPI(task)
      await fetchTasks()
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  // ❌ ELIMINAR TAREA
  async function deleteTask(taskId) {
    try {
      await deleteTaskAPI(taskId)
      await fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  // 🔁 ACTUALIZAR TAREA (title / completed)
  async function updateTask(taskId, updatedTask) {
    try {
      await updateTaskAPI(taskId, {
        title: updatedTask.title,
        completed: updatedTask.completed
      })
      await fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  // ❌ FAVORITOS ELIMINADOS (no existen en Supabase nuevo)

  return {
    tasks,
    fetchTasks,
    createNewTask,
    deleteTask,
    updateTask
  }
})